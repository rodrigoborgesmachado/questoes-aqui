import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import comentariosQuestoesApi from '../../../services/apiServices/comentariosQuestoesApi';
import ConfirmModal from '../../common/Modals/ConfirmModal/ConfirmModal';
import { getLoginUrl, putDateOnPattern } from '../../../utils/functions';
import { appendComments, MAX_COMMENT_LENGTH, toCommentText, validateComment } from './commentUtils';

const PAGE_SIZE = 10;

const QuestionComments = ({ questaoId }) => {
    const location = useLocation();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userName = useSelector((state) => state.auth.name);
    const [comentarios, setComentarios] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [texto, setTexto] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const loadComments = useCallback(async (nextPage) => {
        try {
            const response = await comentariosQuestoesApi.getByQuestao({ questao: questaoId, page: nextPage, quantity: PAGE_SIZE });
            if (!response.success) {
                toast.error('Erro ao buscar os comentários.');
                return;
            }
            setComentarios((previous) => nextPage === 1 ? response.object || [] : appendComments(previous, response.object || []));
            setTotal(response.total || 0);
            setPage(nextPage);
        } catch {
            toast.error('Erro ao buscar os comentários.');
        } finally {
            setIsLoading(false);
        }
    }, [questaoId]);

    useEffect(() => {
        const fetchComments = async () => {
            await loadComments(1);
        };
        fetchComments();
    }, [loadComments]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const error = validateComment(texto);
        if (error) {
            toast.warning(error);
            return;
        }
        setIsSending(true);
        try {
            const response = await comentariosQuestoesApi.add({ comentario: texto.trim(), codigoQuestao: questaoId });
            if (!response.success) {
                toast.error(response.message || 'Erro ao enviar o comentário.');
                return;
            }
            const { codigo, comentario, codigoQuestao, codigoUsuario, created } = response.object;
            setComentarios((previous) => [{ codigo, comentario, codigoQuestao, codigoUsuario, created, nomeUsuario: userName, canEdit: true }, ...previous]);
            setTotal((previous) => previous + 1);
            setTexto('');
        } catch {
            toast.error('Erro ao enviar o comentário.');
        } finally {
            setIsSending(false);
        }
    };

    const handleDelete = async (item) => {
        setItemToDelete(null);
        try {
            const response = await comentariosQuestoesApi.delete(item.codigo);
            if (!response.success) {
                toast.error('Não foi possível excluir o comentário.');
                return;
            }
            setComentarios((previous) => previous.filter((comentario) => comentario.codigo !== item.codigo));
            setTotal((previous) => Math.max(previous - 1, 0));
            toast.success('Comentário excluído.');
        } catch {
            toast.error('Não foi possível excluir o comentário.');
        }
    };

    return (
        <section className="mt-4 pt-4 border-top" aria-labelledby="question-comments-title">
            <h2 id="question-comments-title" className="h6 mb-3">
                <i className="bi bi-chat-left-text me-2" aria-hidden="true"></i>Comentários{total > 0 ? ` (${total})` : ''}
            </h2>

            {isAuthenticated ? (
                <form className="mb-4" onSubmit={handleSubmit}>
                    <label htmlFor="question-comment-text" className="visually-hidden">Seu comentário</label>
                    <textarea
                        id="question-comment-text"
                        className="form-control"
                        rows="3"
                        maxLength={MAX_COMMENT_LENGTH}
                        placeholder="Compartilhe sua resolução ou dúvida"
                        value={texto}
                        onChange={(event) => setTexto(event.target.value)}
                    ></textarea>
                    <div className="d-flex justify-content-between align-items-center gap-2 mt-2">
                        <span className="small text-body-secondary">{texto.length}/{MAX_COMMENT_LENGTH}</span>
                        <button type="submit" className="btn btn-primary btn-sm" disabled={isSending || !texto.trim()}>
                            <i className="bi bi-send me-1" aria-hidden="true"></i>Comentar
                        </button>
                    </div>
                </form>
            ) : (
                <div className="alert alert-light border small mb-4">
                    <Link to={getLoginUrl(`${location.pathname}${location.search}`)}>Entre na sua conta</Link> para comentar.
                </div>
            )}

            {comentarios.length === 0 && !isLoading && (
                <p className="small text-body-secondary mb-0">Nenhum comentário ainda. Seja o primeiro a comentar.</p>
            )}

            <ul className="list-unstyled d-grid gap-3 mb-0">
                {comentarios.map((item) => (
                    <li key={item.codigo} className="p-3 rounded bg-body-tertiary">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                            <div className="small">
                                <strong>{item.nomeUsuario}</strong>
                                <span className="text-body-secondary ms-2">{putDateOnPattern(item.created)}</span>
                            </div>
                            {item.canEdit && (
                                <button type="button" className="btn btn-link link-danger btn-sm p-0" onClick={() => setItemToDelete(item)} aria-label="Excluir comentário">
                                    <i className="bi bi-trash" aria-hidden="true"></i>
                                </button>
                            )}
                        </div>
                        <p className="mb-0" style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>{toCommentText(item.comentario)}</p>
                    </li>
                ))}
            </ul>

            {comentarios.length < total && (
                <div className="text-center mt-3">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { setIsLoading(true); loadComments(page + 1); }} disabled={isLoading}>
                        {isLoading ? 'Carregando...' : 'Carregar mais'}
                    </button>
                </div>
            )}

            <ConfirmModal isOpen={Boolean(itemToDelete)} title="Excluir comentário" message="Deseja excluir este comentário?" confirmData={itemToDelete} onYes={handleDelete} onNo={() => setItemToDelete(null)} />
        </section>
    );
};

export default QuestionComments;
