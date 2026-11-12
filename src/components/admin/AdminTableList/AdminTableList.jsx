import React, { useState, useEffect } from 'react';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../services/configService';
import Pagination from '../../common/Pagination/Pagination';
import ConfirmModal from '../../common/Modals/ConfirmModal/ConfirmModal';
import { toast } from 'react-toastify';

const AdminTableList = ({ title, description, api, columns, getKey, getDeleteMessage }) => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [page, setPage] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const totalPages = Math.ceil(totalItens / quantity);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await api.getPaginated({ page, quantity });
                if (!response.success) {
                    toast.error(response.message || 'Erro ao buscar os itens.');
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
    }, [api, page, quantity, dispatch, refresh]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const deleteItem = async (item) => {
        setItemToDelete(null);
        dispatch(setLoading(true));
        try {
            const response = await api.delete(getKey(item));
            if (response.object) {
                toast.info('Deletado com sucesso!');
                setRefresh(prev => prev + 1);
            } else {
                toast.error(response.message || 'Erro ao deletar');
            }
        } catch {
            toast.error('Erro ao deletar');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-fluid py-4">
            <ConfirmModal isOpen={Boolean(itemToDelete)} title="Excluir registro" message={itemToDelete ? getDeleteMessage(itemToDelete) : ''} confirmData={itemToDelete} onYes={deleteItem} onNo={() => setItemToDelete(null)} />
            <div className="mb-4">
                <h1 className="h3 mb-1">{title}</h1>
                <p className="text-body-secondary mb-0">{description}</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column.label} scope="col">{column.label}</th>
                                    ))}
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={getKey(item)}>
                                        {columns.map((column) => (
                                            <td key={column.label} data-label={column.label}>{column.value(item)}</td>
                                        ))}
                                        <td className="table-actions text-end">
                                            <button type="button" className="btn btn-outline-danger btn-sm" title="Excluir" aria-label="Excluir" onClick={() => setItemToDelete(item)}>
                                                <i className="bi bi-trash" aria-hidden="true"></i>
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

export default AdminTableList;
