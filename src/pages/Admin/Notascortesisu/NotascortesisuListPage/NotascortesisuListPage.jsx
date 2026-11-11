import React, { useState, useEffect } from 'react';
import notascortesisuApi from '../../../../services/apiServices/notascortesisuApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../../services/configService';
import Pagination from '../../../../components/common/Pagination/Pagination';
import ConfirmModal from '../../../../components/common/Modals/ConfirmModal/ConfirmModal';
import { toast } from 'react-toastify';
import FilterComponent from '../../../../components/admin/FilterComponent/FilterComponent';
import { useNavigate } from 'react-router-dom';

const NotascortesisuListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [itemToDelete, setItemToDelete] = useState(null);
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
                const response = await notascortesisuApi.getPaginated({ page, quantity, nome: searchTerm || undefined });
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

    const deleteItem = async (item) => {
        setItemToDelete(null);
        dispatch(setLoading(true));
        try {
            const response = await notascortesisuApi.delete(item.id);
            if (response.success && response.object) {
                toast.info('Deletado com sucesso!');
                setRefresh(prev => prev + 1);
            } else {
                toast.error('Erro ao deletar');
            }
        } catch {
            toast.error('Erro ao deletar');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-fluid py-4">
            <ConfirmModal isOpen={Boolean(itemToDelete)} title="Excluir nota de corte" message={`Deseja excluir a nota de corte #${itemToDelete?.id} (${itemToDelete?.nomeCurso} - ${itemToDelete?.siglaInstituicao})?`} confirmData={itemToDelete} onYes={deleteItem} onNo={() => setItemToDelete(null)} />
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Notas de corte do Sisu</h1>
                    <p className="text-body-secondary mb-0">Gerencie as notas de corte do Sisu.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => navigate('novo')}>
                    <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
                    Novo
                </button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <FilterComponent placeHolder="Instituição ou curso" showTermFilter={true} submitFilter={search} />
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Instituição</th>
                                    <th scope="col">Ano</th>
                                    <th scope="col">Cidade</th>
                                    <th scope="col">Curso</th>
                                    <th scope="col">Turno</th>
                                    <th scope="col">Concorrência</th>
                                    <th scope="col">Vagas</th>
                                    <th scope="col">Nota de corte</th>
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td data-label="Id">{item.id}</td>
                                        <td data-label="Instituição">{item.siglaInstituicao || item.nomeInstituicao}</td>
                                        <td data-label="Ano">{item.year}</td>
                                        <td data-label="Cidade">{item.nomeMunicipioCampus}</td>
                                        <td data-label="Curso">{item.nomeCurso}</td>
                                        <td data-label="Turno">{item.turno}</td>
                                        <td data-label="Concorrência">{item.modoConcorrencia}</td>
                                        <td data-label="Vagas">{item.quantidadeVagas}</td>
                                        <td data-label="Nota de corte">{item.notaCorte}</td>
                                        <td className="table-actions text-end">
                                            <div className="btn-group btn-group-sm" role="group" aria-label="Ações do registro">
                                                <button type="button" className="btn btn-outline-secondary" title="Visualizar" aria-label="Visualizar" onClick={() => navigate(`${item.id}`)}>
                                                    <i className="bi bi-eye" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-primary" title="Editar" aria-label="Editar" onClick={() => navigate(`${item.id}/editar`)}>
                                                    <i className="bi bi-pencil" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-danger" title="Excluir" aria-label="Excluir" onClick={() => setItemToDelete(item)}>
                                                    <i className="bi bi-trash" aria-hidden="true"></i>
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

export default NotascortesisuListPage;
