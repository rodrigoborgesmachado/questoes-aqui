import React, { useState, useEffect } from 'react';
import avaliacaoApi from '../../../../services/apiServices/avaliacaoApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { copyToMemory, putDateOnPattern } from '../../../../utils/functions';
import { getAvaliacaoAlunoUrl } from '../../../../utils/avaliacaoAluno';

const AvaliacaoPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [item, setItem] = useState({});

    useEffect(() => {
        const fetchItem = async () => {
            dispatch(setLoading(true));
            try {
                const response = await avaliacaoApi.getById(id);
                setItem(response.object || {});
            } catch {
                toast.error('Erro ao buscar.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItem();
    }, [id, dispatch]);

    const linkAluno = item.id ? `${window.location.origin}${getAvaliacaoAlunoUrl(item.id, item.isPublic === '1' ? null : item.key)}` : '';

    const copyLinkAluno = async () => {
        if (await copyToMemory(linkAluno)) {
            toast.success('Link copiado.');
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <h1 className="h4 mb-0">Detalhes da Avaliação</h1>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/avaliacoes')}>Voltar</button>
                </div>
                <div className="card-body">
                    <dl className="row mb-4">
                        <dt className="col-sm-3 text-body-secondary">Id</dt>
                        <dd className="col-sm-9">{item.id ?? '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Nome</dt>
                        <dd className="col-sm-9">{item.nome ?? '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Orientação</dt>
                        <dd className="col-sm-9">{item.orientacao ?? '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Professor</dt>
                        <dd className="col-sm-9">{item.usuario ? `${item.usuario.nome} (${item.usuario.email})` : '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Nota total</dt>
                        <dd className="col-sm-9">{item.notaTotal ?? '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Pública</dt>
                        <dd className="col-sm-9">{item.isPublic === '1' ? 'Sim' : 'Não'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Chave</dt>
                        <dd className="col-sm-9 text-break">{item.key ?? '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Link do aluno</dt>
                        <dd className="col-sm-9 text-break">
                            {linkAluno || '-'}
                            {linkAluno && <button type="button" className="btn btn-outline-secondary btn-sm ms-2" onClick={copyLinkAluno} aria-label="Copiar link do aluno"><i className="bi bi-clipboard" aria-hidden="true"></i></button>}
                        </dd>
                        <dt className="col-sm-3 text-body-secondary">Status</dt>
                        <dd className="col-sm-9">{item.isActive === '1' ? 'Ativo' : 'Desativado'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Criado</dt>
                        <dd className="col-sm-9">{putDateOnPattern(item.createdOn) || '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Atualizado</dt>
                        <dd className="col-sm-9">{putDateOnPattern(item.updatedOn) || '-'}</dd>
                    </dl>
                    <h2 className="h5 mb-3">Questões ({item.questoesAvaliacao?.length ?? 0})</h2>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Questão</th>
                                    <th scope="col">Matéria</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Prova</th>
                                    <th scope="col">Nota</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(item.questoesAvaliacao || []).map((questaoAvaliacao) => (
                                    <tr key={questaoAvaliacao.id}>
                                        <td data-label="Questão"><Link to={`/questoes/${questaoAvaliacao.idQuestao}/editar`}>#{questaoAvaliacao.idQuestao}</Link></td>
                                        <td data-label="Matéria">{questaoAvaliacao.questao?.materia}</td>
                                        <td data-label="Assunto">{questaoAvaliacao.questao?.assunto}</td>
                                        <td data-label="Prova">{questaoAvaliacao.questao?.prova?.nomeProva}</td>
                                        <td data-label="Nota">{questaoAvaliacao.notaQuestao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvaliacaoPage;
