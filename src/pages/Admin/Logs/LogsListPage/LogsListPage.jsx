import React, { useState, useEffect } from 'react';
import loggerApi from '../../../../services/apiServices/loggerApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../../services/configService';
import Pagination from '../../../../components/common/Pagination/Pagination';
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../../utils/functions';
import FilterComponent from '../../../../components/admin/FilterComponent/FilterComponent';
import BaseModal from '../../../../components/common/Modals/BaseModal/BaseModal';

const LogsListPage = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItens, setTotalItens] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const totalPages = Math.ceil(totalItens / quantity);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await loggerApi.getPaginated({ page, quantity, message: searchTerm || undefined });
                setItems(response.object || []);
                setTotalItens(response.total || 0);
            } catch {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, quantity, searchTerm, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const search = ({ term } = {}) => {
        setSearchTerm(term);
        setPage(1);
    };

    return (
        <div className="container-fluid py-4">
            <BaseModal isOpen={Boolean(selected)} title="Log" size="modal-lg" onClose={() => setSelected(null)}>
                {selected && (
                    <dl className="row mb-0">
                        <dt className="col-sm-3 text-body-secondary">Id</dt>
                        <dd className="col-sm-9">{selected.Id}</dd>
                        <dt className="col-sm-3 text-body-secondary">Descrição</dt>
                        <dd className="col-sm-9 text-break">{selected.descricao ?? '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Criado</dt>
                        <dd className="col-sm-9">{putDateOnPattern(selected.created) || '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Atualizado</dt>
                        <dd className="col-sm-9">{putDateOnPattern(selected.updated) || '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">Tipo</dt>
                        <dd className="col-sm-9">{selected.tipo ?? '-'}</dd>
                        <dt className="col-sm-3 text-body-secondary">StackTrace</dt>
                        <dd className="col-sm-9 text-break small font-monospace">{selected.stackTrace ?? '-'}</dd>
                    </dl>
                )}
            </BaseModal>
            <div className="mb-4">
                <h1 className="h3 mb-1">Logs</h1>
                <p className="text-body-secondary mb-0">Registros de log da API.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <FilterComponent placeHolder="Descrição" showTermFilter={true} submitFilter={search} />
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Código</th>
                                    <th scope="col">Descrição</th>
                                    <th scope="col">Data</th>
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.Id}>
                                        <td data-label="Código">{item.Id}</td>
                                        <td data-label="Descrição" className="text-break">{item.descricao}</td>
                                        <td data-label="Data" className="text-nowrap">{putDateOnPattern(item.created)}</td>
                                        <td className="table-actions text-end">
                                            <button type="button" className="btn btn-outline-secondary btn-sm" title="Visualizar" aria-label="Visualizar" onClick={() => setSelected(item)}>
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

export default LogsListPage;
