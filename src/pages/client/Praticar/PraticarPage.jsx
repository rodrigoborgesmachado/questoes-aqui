import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../services/redux/loadingSlice';
import questoesApi from '../../../services/apiServices/questoesApi';
import respostasQuestoesApi from '../../../services/apiServices/respostasQuestoesApi';
import QuestionView from '../../../components/client/QuestionView/QuestionView';
import QuestionComments from '../../../components/client/QuestionComments/QuestionComments';

const FILTER_KEYS = ['id', 'codigoProva', 'tipo', 'randon', 'materias', 'bancas', 'tipos', 'provas', 'assuntos'];

const PraticarPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const filters = useMemo(() => Object.fromEntries(FILTER_KEYS.filter((key) => searchParams.get(key)).map((key) => [key, searchParams.get(key)])), [searchParams]);
    const isSingle = Boolean(filters.id);
    const isRandom = filters.randon === 'true';
    const [page, setPage] = useState(() => Math.max(Number(searchParams.get('inicio')) || 1, 1));
    const [questao, setQuestao] = useState(null);
    const [total, setTotal] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [answer, setAnswer] = useState(null);
    const [score, setScore] = useState({ respondidas: 0, acertos: 0 });

    useEffect(() => {
        const fetchQuestao = async () => {
            dispatch(setLoading(true));
            setAnswer(null);
            try {
                const response = await questoesApi.getPaginated({ page, quantity: 1, anexos: true, ...filters });
                if (response.success && response.object?.length > 0) {
                    setQuestao(response.object[0]);
                    setTotal(response.total || 0);
                    setIsFinished(false);
                } else {
                    setQuestao(null);
                    setIsFinished(true);
                }
            } catch {
                toast.error('Erro ao buscar a questão.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchQuestao();
    }, [page, filters, dispatch]);

    const handleSelect = async (resposta) => {
        if (answer) {
            return;
        }
        dispatch(setLoading(true));
        try {
            const response = await respostasQuestoesApi.validaResposta(resposta.codigo);
            if (!response.success) {
                toast.error('Erro ao validar a resposta.');
                return;
            }
            const certa = response.object?.certa === '1';
            let correctCode = certa ? resposta.codigo : null;
            if (!certa) {
                const correta = await respostasQuestoesApi.getRespostaCorreta(questao.Id);
                correctCode = correta.object?.codigo ?? null;
            }
            setAnswer({ selectedCode: resposta.codigo, correctCode, certa });
            setScore((previous) => ({ respondidas: previous.respondidas + 1, acertos: previous.acertos + (certa ? 1 : 0) }));
        } catch {
            toast.error('Erro ao validar a resposta.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const showNavigation = !isSingle;
    const position = isRandom ? null : page;

    return (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <button type="button" className="btn btn-link link-secondary small px-0" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>Voltar
                </button>
                <div className="d-flex flex-wrap gap-2 small">
                    <span className="badge rounded-pill bg-body border text-body px-3 py-2">
                        <i className="bi bi-pencil-square me-1" aria-hidden="true"></i>{score.respondidas} respondidas
                    </span>
                    <span className="badge rounded-pill bg-body border text-success px-3 py-2">
                        <i className="bi bi-check2-circle me-1" aria-hidden="true"></i>{score.acertos} acertos
                    </span>
                </div>
            </div>

            {showNavigation && position && total > 0 && !isFinished && (
                <div className="mb-3">
                    <div className="d-flex justify-content-between small text-body-secondary mb-1">
                        <span>Questão {position} de {total}</span>
                        <span>{Math.round((position / total) * 100)}%</span>
                    </div>
                    <div className="progress client-progress" role="progressbar" aria-valuenow={position} aria-valuemin="1" aria-valuemax={total}>
                        <div className="progress-bar" style={{ width: `${(position / total) * 100}%` }}></div>
                    </div>
                </div>
            )}

            {questao && !isFinished && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        <QuestionView questao={questao} selectedCode={answer?.selectedCode} correctCode={answer?.correctCode} disabled={Boolean(answer)} onSelect={handleSelect} />
                        {answer && (
                            <div className={`alert ${answer.certa ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2 mt-4 mb-0`} role="status">
                                <i className={`bi ${answer.certa ? 'bi-emoji-smile' : 'bi-emoji-frown'} fs-5`} aria-hidden="true"></i>
                                {answer.certa ? 'Resposta correta! Mandou bem.' : 'Resposta incorreta. A alternativa correta está destacada em verde.'}
                            </div>
                        )}
                        {answer && <QuestionComments questaoId={questao.Id} />}
                    </div>
                    {showNavigation && (
                        <div className="card-footer bg-body border-0 d-flex justify-content-between gap-2 p-3">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setPage(page - 1)} disabled={page <= 1 || isRandom}>
                                <i className="bi bi-chevron-left me-1" aria-hidden="true"></i>Anterior
                            </button>
                            <button type="button" className={`btn ${answer ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPage(page + 1)}>
                                {answer ? 'Próxima' : 'Pular'}<i className="bi bi-chevron-right ms-1" aria-hidden="true"></i>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isFinished && (
                <div className="card border-0 shadow-sm text-center">
                    <div className="card-body p-5">
                        <i className="bi bi-flag-fill display-5 text-app-primary" aria-hidden="true"></i>
                        <h1 className="h4 mt-3">{page > 1 ? 'Você chegou ao fim!' : 'Nenhuma questão encontrada'}</h1>
                        <p className="text-body-secondary">
                            {page > 1 ? `Nesta sessão você respondeu ${score.respondidas} questões e acertou ${score.acertos}.` : 'Tente outros filtros ou escolha uma prova.'}
                        </p>
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                            <Link to="/provas" className="btn btn-outline-secondary">Ver provas</Link>
                            <Link to="/desempenho" className="btn btn-primary">Meu desempenho</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PraticarPage;
