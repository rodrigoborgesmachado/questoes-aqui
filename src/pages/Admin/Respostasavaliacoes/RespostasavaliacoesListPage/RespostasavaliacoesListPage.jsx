import React, { useState, useEffect } from 'react';
import respostasavaliacoesApi from '../../../../services/apiServices/respostasavaliacoesApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../../services/configService';
import Pagination from '../../../../components/common/Pagination/Pagination';
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../../utils/functions';
import FilterComponent from '../../../../components/admin/FilterComponent/FilterComponent';
import { useNavigate } from 'react-router-dom';

const RespostasavaliacoesListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [avaliacao, setAvaliacao] = useState('');
    const [totalItens, setTotalItens] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const totalPages = Math.ceil(totalItens / quantity);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await respostasavaliacoesApi.getPaginated({ page, quantity, avaliacao: avaliacao || undefined });
                if (!response.success) {
                    toast.error(response.message || 'Erro ao buscar os itens.');
                    return;
                }
                setItems(response.object || []);
                setTotalItens(response.total || 0);
            } catch {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, quantity, avaliacao, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const search = ({ term } = {}) => {
        const id = parseInt(term, 10);
        setAvaliacao(Number.isNaN(id) ? '' : id);
        setPage(1);
    };

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h1 className="h3 mb-1">Respostas das Avaliações</h1>
                <p className="text-body-secondary mb-0">Respostas registradas nas avaliações.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <FilterComponent placeHolder="Id da avaliação" showTermFilter={true} submitFilter={search} />
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Avaliação</th>
                                    <th scope="col">Questão</th>
                                    <th scope="col">Prova</th>
                                    <th scope="col">Usuário</th>
                                    <th scope="col">Data</th>
                                    <th scope="col">Resposta</th>
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td data-label="Id">{item.id}</td>
                                        <td data-label="Avaliação">{item.avaliacao?.nome ?? item.idAvaliacao}</td>
                                        <td data-label="Questão">{item.idQuestao}</td>
                                        <td data-label="Prova">{item.questao?.prova?.nomeProva}</td>
                                        <td data-label="Usuário">{item.createdBy}</td>
                                        <td data-label="Data">{putDateOnPattern(item.createdOn)}</td>
                                        <td data-label="Resposta">
                                            <span className={`badge ${item.resposta?.certa === '1' ? 'text-bg-success' : 'text-bg-danger'}`}>
                                                {item.resposta?.certa === '1' ? 'Certa' : 'Errada'}
                                            </span>
                                        </td>
                                        <td className="table-actions text-end">
                                            <button type="button" className="btn btn-outline-secondary btn-sm" title="Visualizar" aria-label="Visualizar" onClick={() => navigate(`${item.id}`)}>
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

export default RespostasavaliacoesListPage;
