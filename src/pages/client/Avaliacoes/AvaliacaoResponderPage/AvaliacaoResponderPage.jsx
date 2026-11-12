import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../../services/redux/loadingSlice';
import respostasavaliacoesApi from '../../../../services/apiServices/respostasavaliacoesApi';
import QuestionView from '../../../../components/client/QuestionView/QuestionView';
import ConfirmModal from '../../../../components/common/Modals/ConfirmModal/ConfirmModal';
import { buildRespostasAvaliacao } from '../../../../utils/avaliacaoAluno';

const AvaliacaoResponderPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const chave = searchParams.get('chave') || undefined;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [avaliacao, setAvaliacao] = useState(null);
    const [index, setIndex] = useState(0);
    const [selecionadas, setSelecionadas] = useState({});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const resultadoUrl = `/avaliacoes/${id}/resultado${chave ? `?chave=${encodeURIComponent(chave)}` : ''}`;

    useEffect(() => {
        const fetchAvaliacao = async () => {
            dispatch(setLoading(true));
            try {
                const respostas = await respostasavaliacoesApi.getMinhasRespostas(id);
                if (respostas.success && respostas.object?.length > 0) {
                    navigate(resultadoUrl, { replace: true });
                    return;
                }
                const response = await respostasavaliacoesApi.getAvaliacaoAluno(id, chave);
                if (response.success && response.object?.questoesAvaliacao?.length > 0) {
                    setAvaliacao(response.object);
                } else {
                    toast.warn('Avaliação não encontrada.');
                    navigate('/', { replace: true });
                }
            } catch {
                toast.error('Erro ao buscar a avaliação.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchAvaliacao();
    }, [id, chave, resultadoUrl, dispatch, navigate]);

    const finish = async () => {
        setIsConfirmOpen(false);
        setIsFinishing(true);
        dispatch(setLoading(true));
        try {
            const response = await respostasavaliacoesApi.finalizar(id, chave, buildRespostasAvaliacao(selecionadas));
            if (!response.success) {
                toast.error(response.message || 'Erro ao finalizar a avaliação.');
                setIsFinishing(false);
                return;
            }
            toast.success('Avaliação finalizada!');
            navigate(resultadoUrl, { replace: true });
        } catch {
            toast.error('Erro ao finalizar a avaliação.');
            setIsFinishing(false);
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (!avaliacao) {
        return null;
    }

    const questoes = avaliacao.questoesAvaliacao;
    const total = questoes.length;
    const atual = questoes[index];
    const respondidas = Object.keys(selecionadas).length;
    const progress = (respondidas / total) * 100;

    return (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Finalizar avaliação"
                message={`Você respondeu ${respondidas} de ${total} questões. Depois de finalizar não será possível alterar as respostas.`}
                yesLabel="Finalizar"
                noLabel="Continuar"
                onYes={finish}
                onNo={() => setIsConfirmOpen(false)}
            />
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <span className="small text-body-secondary d-block">Avaliação{avaliacao.usuario?.nome ? ` · Prof. ${avaliacao.usuario.nome}` : ''}</span>
                        <strong>{avaliacao.nome}</strong>
                    </div>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setIsConfirmOpen(true)} disabled={isFinishing || respondidas === 0}>Finalizar</button>
                </div>
                {avaliacao.orientacao && <p className="px-3 small mb-3">{avaliacao.orientacao}</p>}
                <div className="px-3 pb-3">
                    <div className="d-flex justify-content-between small text-body-secondary mb-1">
                        <span>Questão {index + 1} de {total}</span>
                        <span>{respondidas} respondidas</span>
                    </div>
                    <div className="progress client-progress" role="progressbar" aria-valuenow={respondidas} aria-valuemin="0" aria-valuemax={total}>
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <QuestionView
                        questao={atual.questao}
                        selectedCode={selecionadas[atual.idQuestao] ?? null}
                        disabled={isFinishing}
                        onSelect={(resposta) => setSelecionadas({ ...selecionadas, [atual.idQuestao]: resposta.codigo })}
                    />
                    <div className="d-flex justify-content-between gap-2 mt-4">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setIndex(index - 1)} disabled={index === 0}>Anterior</button>
                        {index < total - 1
                            ? <button type="button" className="btn btn-primary" onClick={() => setIndex(index + 1)}>Próxima</button>
                            : <button type="button" className="btn btn-primary" onClick={() => setIsConfirmOpen(true)} disabled={isFinishing || respondidas === 0}>Finalizar</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvaliacaoResponderPage;
