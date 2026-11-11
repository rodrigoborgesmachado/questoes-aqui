import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../../services/redux/loadingSlice';
import questoesApi from '../../../../services/apiServices/questoesApi';
import respostasQuestoesApi from '../../../../services/apiServices/respostasQuestoesApi';
import simuladoApi from '../../../../services/apiServices/simuladoApi';
import QuestionView from '../../../../components/client/QuestionView/QuestionView';
import ConfirmModal from '../../../../components/common/Modals/ConfirmModal/ConfirmModal';

const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

const SimuladoPage = () => {
    const { provaId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const startedAt = useRef(0);
    const [page, setPage] = useState(1);
    const [questao, setQuestao] = useState(null);
    const [total, setTotal] = useState(0);
    const [respostas, setRespostas] = useState([]);
    const [elapsed, setElapsed] = useState(0);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);

    useEffect(() => {
        startedAt.current = Date.now();
        const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
        return () => clearInterval(timer);
    }, []);

    const finish = async (lista) => {
        setIsConfirmOpen(false);
        if (lista.length === 0) {
            toast.info('Nenhuma questão respondida. Simulado encerrado.');
            navigate('/simulados', { replace: true });
            return;
        }
        setIsFinishing(true);
        dispatch(setLoading(true));
        try {
            const response = await simuladoApi.create({
                respostas: JSON.stringify(lista),
                codigoProva: Number(provaId),
                tempo: Math.floor((Date.now() - startedAt.current) / 1000),
            });
            if (!response.success) {
                toast.error('Erro ao salvar o simulado.');
                setIsFinishing(false);
                return;
            }
            simuladoApi.sendReportEmail(response.object.codigo).catch(() => {});
            toast.success('Simulado finalizado!');
            navigate(`/simulados/resultado/${response.object.codigo}`, { replace: true });
        } catch {
            toast.error('Erro ao salvar o simulado.');
            setIsFinishing(false);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (isFinishing) {
            return;
        }
        const fetchQuestao = async () => {
            dispatch(setLoading(true));
            try {
                const response = await questoesApi.getPaginated({ page, quantity: 1, anexos: true, codigoProva: provaId });
                if (response.success && response.object?.length > 0) {
                    setQuestao(response.object[0]);
                    setTotal(response.total || 0);
                } else if (page === 1) {
                    toast.warn('Esta prova não possui questões.');
                    navigate('/provas', { replace: true });
                }
            } catch {
                toast.error('Erro ao buscar a questão.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchQuestao();
    }, [page, provaId, isFinishing, dispatch, navigate]);

    const handleSelect = async (resposta) => {
        dispatch(setLoading(true));
        try {
            const response = await respostasQuestoesApi.validaResposta(resposta.codigo);
            if (!response.success) {
                toast.error('Erro ao registrar a resposta.');
                return;
            }
            const lista = [...respostas, {
                codigoProva: questao.codigoProva,
                codigoQuestao: questao.Id,
                certa: response.object?.certa,
                numeroQuestao: `${questao.numeroQuestao}`,
            }];
            setRespostas(lista);
            if (page >= total) {
                await finish(lista);
            } else {
                setPage(page + 1);
            }
        } catch {
            toast.error('Erro ao registrar a resposta.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const progress = total > 0 ? (respostas.length / total) * 100 : 0;

    return (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Finalizar simulado"
                message={`Você respondeu ${respostas.length} de ${total} questões. Deseja finalizar agora? As questões não respondidas não entram no resultado.`}
                yesLabel="Finalizar"
                noLabel="Continuar"
                onYes={() => finish(respostas)}
                onNo={() => setIsConfirmOpen(false)}
            />
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <span className="small text-body-secondary d-block">Simulado</span>
                        <strong>{questao?.prova?.nomeProva}</strong>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="badge rounded-pill bg-body border text-body px-3 py-2 fs-6">
                            <i className="bi bi-stopwatch me-1" aria-hidden="true"></i>{formatTime(elapsed)}
                        </span>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setIsConfirmOpen(true)} disabled={isFinishing}>Finalizar</button>
                    </div>
                </div>
                <div className="px-3 pb-3">
                    <div className="d-flex justify-content-between small text-body-secondary mb-1">
                        <span>Questão {Math.min(page, total || 1)} de {total}</span>
                        <span>{respostas.length} respondidas</span>
                    </div>
                    <div className="progress client-progress" role="progressbar" aria-valuenow={respostas.length} aria-valuemin="0" aria-valuemax={total}>
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            {questao && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        <QuestionView questao={questao} disabled={isFinishing} onSelect={handleSelect} />
                        <p className="small text-body-secondary mt-4 mb-0">No simulado o resultado aparece só no final. Escolha uma alternativa para seguir.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimuladoPage;
