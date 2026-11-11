import React, { useState, useEffect } from 'react';
import respostasusuariosApi from '../../../services/apiServices/respostasusuariosApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../services/configService';
import Pagination from '../../../components/common/Pagination/Pagination';
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../utils/functions';
import { useNavigate } from 'react-router-dom';

const HistoricoRespostasListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const totalPages = Math.ceil(totalItens / quantity);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await respostasusuariosApi.getPaginated({ page, quantity });
                setItems(response.object || []);
                setTotalItens(response.total || 0);
            } catch {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, quantity, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h1 className="h3 mb-1">Histórico de respostas</h1>
                <p className="text-body-secondary mb-0">Respostas registradas por todos os usuários.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Questão</th>
                                    <th scope="col">Prova</th>
                                    <th scope="col">Data</th>
                                    <th scope="col">Resposta</th>
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.Id}>
                                        <td data-label="Id">{item.Id}</td>
                                        <td data-label="Nome">{item.usuario?.nome}</td>
                                        <td data-label="Email">{item.usuario?.email}</td>
                                        <td data-label="Questão">{item.questao?.Id}</td>
                                        <td data-label="Prova">{item.questao?.prova?.nomeProva}</td>
                                        <td data-label="Data">{putDateOnPattern(item.dataResposta)}</td>
                                        <td data-label="Resposta">
                                            <span className={`badge ${item.resposta?.certa === '1' ? 'text-bg-success' : 'text-bg-danger'}`}>
                                                {item.resposta?.certa === '1' ? 'Certa' : 'Errada'}
                                            </span>
                                        </td>
                                        <td className="table-actions text-end">
                                            <button type="button" className="btn btn-outline-secondary btn-sm" title="Visualizar questão" aria-label="Visualizar questão" onClick={() => navigate(`/questoes/${item.questao?.Id}/editar`)}>
                                                <i className="bi bi-eye" aria-hidden="true"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer bg-body border-0 d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <small className="text-body-secondary">Total de itens: {totalItens}</small>
                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    );
};

export default HistoricoRespostasListPage;
