import React, { useState, useEffect } from 'react';
import emailApi from '../../../../services/apiServices/emailApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../../services/configService';
import Pagination from '../../../../components/common/Pagination/Pagination';
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../../utils/functions';
import { hideEmailLinks } from '../../../../utils/emailHtml';
import FilterComponent from '../../../../components/admin/FilterComponent/FilterComponent';
import BaseModal from '../../../../components/common/Modals/BaseModal/BaseModal';
import ConfirmModal from '../../../../components/common/Modals/ConfirmModal/ConfirmModal';

const statusLabel = (status) => ({ 1: 'Enviado', 2: 'Erro' })[status] ?? '-';

const EmailsListPage = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [itemToResend, setItemToResend] = useState(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItens, setTotalItens] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const totalPages = Math.ceil(totalItens / quantity);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await emailApi.getPaginated({ page, quantity, filtro: searchTerm || undefined });
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

    const resendEmail = async (item) => {
        setItemToResend(null);
        dispatch(setLoading(true));
        try {
            const response = await emailApi.resendById(item.codigo);
            if (response.object) {
                setItems((current) => current.map((email) => (email.codigo === item.codigo ? { ...email, status: response.object.status } : email)));
            }
            if (response.success) {
                toast.success('Email reenviado!');
            } else {
                toast.warn('Não foi possível reenviar o email.');
            }
        } catch {
            toast.warn('Não foi possível reenviar o email.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-fluid py-4">
            <ConfirmModal isOpen={Boolean(itemToResend)} title="Reenviar email" message={`Deseja reenviar o email "${itemToResend?.assunto}" para ${itemToResend?.destinatario}?`} confirmData={itemToResend} onYes={resendEmail} onNo={() => setItemToResend(null)} />
            <BaseModal isOpen={Boolean(selected)} title="Email" size="modal-lg" onClose={() => setSelected(null)}>
                {selected && (
                    <>
                        <dl className="row">
                            <dt className="col-sm-3 text-body-secondary">Código</dt>
                            <dd className="col-sm-9">{selected.codigo}</dd>
                            <dt className="col-sm-3 text-body-secondary">Destinatário</dt>
                            <dd className="col-sm-9 text-break">{selected.destinatario ?? '-'}</dd>
                            <dt className="col-sm-3 text-body-secondary">Assunto</dt>
                            <dd className="col-sm-9 text-break">{selected.assunto ?? '-'}</dd>
                            <dt className="col-sm-3 text-body-secondary">Data de envio</dt>
                            <dd className="col-sm-9">{putDateOnPattern(selected.dataEnvio) || '-'}</dd>
                            <dt className="col-sm-3 text-body-secondary">Status</dt>
                            <dd className="col-sm-9">{statusLabel(selected.status)}</dd>
                            <dt className="col-sm-3 text-body-secondary">Observação</dt>
                            <dd className="col-sm-9 text-break">{selected.observacao || '-'}</dd>
                        </dl>
                        <iframe title="Texto do email" sandbox="" srcDoc={hideEmailLinks(selected.texto)} className="w-100 border rounded bg-white" style={{ height: '60vh' }}></iframe>
                    </>
                )}
            </BaseModal>
            <div className="mb-4">
                <h1 className="h3 mb-1">Emails enviados</h1>
                <p className="text-body-secondary mb-0">Emails enviados pela API.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <FilterComponent placeHolder="Destinatário ou assunto" showTermFilter={true} submitFilter={search} />
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Destinatário</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Data de envio</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.codigo}>
                                        <td data-label="Destinatário" className="text-break">{item.destinatario}</td>
                                        <td data-label="Assunto" className="text-break">{item.assunto}</td>
                                        <td data-label="Data de envio" className="text-nowrap">{putDateOnPattern(item.dataEnvio)}</td>
                                        <td data-label="Status">
                                            <span className={`badge ${item.status === '1' ? 'text-bg-success' : 'text-bg-danger'}`}>
                                                {statusLabel(item.status)}
                                            </span>
                                        </td>
                                        <td className="table-actions text-end">
                                            <div className="btn-group btn-group-sm">
                                                <button type="button" className="btn btn-outline-secondary" title="Visualizar" aria-label="Visualizar" onClick={() => setSelected(item)}>
                                                    <i className="bi bi-eye" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-primary" title="Reenviar" aria-label="Reenviar" onClick={() => setItemToResend(item)}>
                                                    <i className="bi bi-send" aria-hidden="true"></i>
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

export default EmailsListPage;
