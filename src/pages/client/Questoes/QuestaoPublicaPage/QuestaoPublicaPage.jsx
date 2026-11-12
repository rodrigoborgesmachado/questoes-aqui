import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../../services/redux/loadingSlice';
import publicQuestoesApi from '../../../../services/apiServices/publicQuestoesApi';
import QuestionView from '../../../../components/client/QuestionView/QuestionView';
import QuestionComments from '../../../../components/client/QuestionComments/QuestionComments';

const QuestaoPublicaPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [questao, setQuestao] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const answerUrl = `/praticar?id=${id}`;

    useEffect(() => {
        const fetchItem = async () => {
            dispatch(setLoading(true));
            try {
                const response = await publicQuestoesApi.getQuestaoById(id);
                setQuestao(response.object || null);
            } catch {
                toast.error('Erro ao buscar a questão.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItem();
    }, [id, dispatch]);

    return (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
            <button type="button" className="btn btn-link link-secondary small px-0 mb-3" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>Voltar
            </button>
            {questao && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        <QuestionView questao={questao} onSelect={() => navigate(answerUrl)} />
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-4">
                            <span className="small text-body-secondary">
                                {isAuthenticated ? 'Escolha uma alternativa para responder.' : 'Entre na sua conta para responder e ver o gabarito.'}
                            </span>
                            <Link to={answerUrl} className="btn btn-primary">Responder esta questão</Link>
                        </div>
                        {!isAuthenticated && (showComments ? <QuestionComments questaoId={Number(id)} /> : (
                            <div className="mt-4 pt-4 border-top">
                                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowComments(true)}>
                                    <i className="bi bi-chat-left-text me-1" aria-hidden="true"></i>Ver comentários
                                </button>
                                <p className="small text-body-secondary mt-2 mb-0">Os comentários podem revelar a resposta.</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestaoPublicaPage;
