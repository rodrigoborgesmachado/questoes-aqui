import React, { useState, useEffect } from 'react';
import avaliacaoApi from '../../../../services/apiServices/avaliacaoApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../../services/configService';
import Pagination from '../../../../components/common/Pagination/Pagination';
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../../utils/functions';
import FilterComponent from '../../../../components/admin/FilterComponent/FilterComponent';
import { useNavigate } from 'react-router-dom';

const AvaliacaoListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItens, setTotalItens] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const totalPages = Math.ceil(totalItens / quantity);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await avaliacaoApi.getPaginated({ page, quantity, nome: searchTerm || undefined });
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
    }, [page, quantity, searchTerm, dispatch, refresh]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const search = ({ term } = {}) => {
        setSearchTerm(term);
        setPage(1);
    };

    const changeStatus = async (item) => {
        dispatch(setLoading(true));
        try {
            const response = await avaliacaoApi.updateStatus(item.id, item.isActive !== '1');
            if (response.success) {
                toast.success('Atualizado com sucesso!');
                setRefresh(prev => prev + 1);
            } else {
                toast.error('Não foi possível atualizar');
            }
        } catch {
            toast.error('Não foi possível atualizar');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h1 className="h3 mb-1">Avaliações</h1>
                <p className="text-body-secondary mb-0">Avaliações criadas pelos professores.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <FilterComponent placeHolder="Nome" showTermFilter={true} submitFilter={search} />
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Professor</th>
                                    <th scope="col">Questões</th>
                                    <th scope="col">Nota total</th>
                                    <th scope="col">Pública</th>
                                    <th scope="col">Criado</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td data-label="Id">{item.id}</td>
                                        <td data-label="Nome">{item.nome}</td>
                                        <td data-label="Professor">{item.usuario?.nome}</td>
                                        <td data-label="Questões">{item.questoesAvaliacao?.length ?? 0}</td>
                                        <td data-label="Nota total">{item.notaTotal}</td>
                                        <td data-label="Pública">{item.isPublic === '1' ? 'Sim' : 'Não'}</td>
                                        <td data-label="Criado">{putDateOnPattern(item.createdOn)}</td>
                                        <td data-label="Status">
                                            <span className={`badge ${item.isActive === '1' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                                                {item.isActive === '1' ? 'Ativo' : 'Desativado'}
                                            </span>
                                        </td>
                                        <td className="table-actions text-end">
                                            <div className="btn-group btn-group-sm" role="group" aria-label="Ações do registro">
                                                <button type="button" className="btn btn-outline-secondary" title="Visualizar" aria-label="Visualizar" onClick={() => navigate(`${item.id}`)}>
                                                    <i className="bi bi-eye" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className={item.isActive === '1' ? 'btn btn-outline-danger' : 'btn btn-outline-success'} title={item.isActive === '1' ? 'Desativar' : 'Ativar'} aria-label={item.isActive === '1' ? 'Desativar' : 'Ativar'} onClick={() => changeStatus(item)}>
                                                    <i className={item.isActive === '1' ? 'bi bi-pause-circle' : 'bi bi-check-circle'} aria-hidden="true"></i>
                                                </button>
                                            </div>
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

export default AvaliacaoListPage;
