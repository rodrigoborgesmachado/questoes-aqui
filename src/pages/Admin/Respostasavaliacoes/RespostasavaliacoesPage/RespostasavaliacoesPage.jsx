import React, { useState, useEffect } from 'react';
import respostasavaliacoesApi from '../../../../services/apiServices/respostasavaliacoesApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../../utils/functions';

const RespostasavaliacoesPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [item, setItem] = useState({});

    useEffect(() => {
        const fetchItem = async () => {
            dispatch(setLoading(true));
            try {
                const response = await respostasavaliacoesApi.getById(id);
                setItem(response.object || {});
            } catch {
                toast.error('Erro ao buscar.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItem();
    }, [id, dispatch]);

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <h1 className="h4 mb-0">Detalhes da Resposta da Avaliação</h1>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/respostas-avaliacoes')}>Voltar</button>
                </div>
                <div className="card-body">
                    <dl className="row mb-0">
                        <dt className="col-sm-3 text-body-secondary">Id</dt>
                        <dd className="col-sm-9">{item.id ?? '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Avaliação</dt>
                        <dd className="col-sm-9">{item.idAvaliacao ? <Link to={`/avaliacoes/${item.idAvaliacao}`}>#{item.idAvaliacao} {item.avaliacao?.nome}</Link> : '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Questão</dt>
                        <dd className="col-sm-9">{item.idQuestao ? <Link to={`/questoes/${item.idQuestao}/editar`}>#{item.idQuestao}</Link> : '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Matéria</dt>
                        <dd className="col-sm-9">{item.questao?.materia ?? '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Prova</dt>
                        <dd className="col-sm-9">{item.questao?.prova?.nomeProva ?? '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Resposta</dt>
                        <dd className="col-sm-9">{item.resposta?.textoResposta || `#${item.idResposta ?? '-'}`}</dd>
                        <dt className="col-sm-3 text-body-secondary">Correta</dt>
                        <dd className="col-sm-9">{item.resposta?.certa === '1' ? 'Sim' : 'Não'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Usuário</dt>
                        <dd className="col-sm-9">{item.createdBy ?? '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Criado</dt>
                        <dd className="col-sm-9">{putDateOnPattern(item.createdOn) || '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Atualizado</dt>
                        <dd className="col-sm-9">{putDateOnPattern(item.updatedOn) || '-'}</dd>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default RespostasavaliacoesPage;
