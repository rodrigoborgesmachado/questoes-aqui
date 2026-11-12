import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import reportesQuestoesApi from '../../../services/apiServices/reportesQuestoesApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import configService from '../../../services/configService';
import Pagination from '../../../components/common/Pagination/Pagination';
import BaseModal from '../../../components/common/Modals/BaseModal/BaseModal';
import ConfirmModal from '../../../components/common/Modals/ConfirmModal/ConfirmModal';
import { putDateOnPattern } from '../../../utils/functions';
import { countMotivos, getMotivoLabel, getOpenCodes, getStatus, REPORT_STATUS } from '../../../components/client/ReportQuestion/reportUtils';

const ACTION_LABELS = { resolvido: 'resolver', descartado: 'descartar' };

const ReportesQuestoesListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [action, setAction] = useState(null);
    const [status, setStatus] = useState('aberto');
    const [page, setPage] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const totalPages = Math.ceil(totalItens / quantity);

    const fetchItems = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const response = await reportesQuestoesApi.getAgrupados({ page, quantity, status: status || undefined });
            if (!response.success) {
                toast.error('Erro ao buscar os reportes.');
                return;
            }
            setItems(response.object || []);
            setTotalItens(response.total || 0);
        } catch {
            toast.error('Erro ao buscar os reportes.');
        } finally {
            dispatch(setLoading(false));
        }
    }, [page, quantity, status, dispatch]);

    useEffect(() => {
        const loadItems = async () => {
            await fetchItems();
        };
        loadItems();
    }, [fetchItems]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleUpdateStatus = async ({ codigos, status: newStatus }) => {
        setAction(null);
        dispatch(setLoading(true));
        try {
            const response = await reportesQuestoesApi.updateStatus({ codigos, status: newStatus });
            if (!response.success) {
                toast.error(response.message || 'Não foi possível atualizar os reportes.');
                return;
            }
            toast.success(`${response.object} reporte(s) marcado(s) como ${getStatus(newStatus).label.toLowerCase()}.`);
            setSelected(null);
            await fetchItems();
        } catch {
            toast.error('Não foi possível atualizar os reportes.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const confirmAction = (codigos, newStatus) => setAction({ codigos, status: newStatus });

    const renderActions = (codigos) => codigos.length > 0 && (
        <>
            <button type="button" className="btn btn-outline-success btn-sm" title="Resolver" aria-label="Resolver" onClick={() => confirmAction(codigos, 'resolvido')}>
                <i className="bi bi-check2" aria-hidden="true"></i>
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm" title="Descartar" aria-label="Descartar" onClick={() => confirmAction(codigos, 'descartado')}>
                <i className="bi bi-x-lg" aria-hidden="true"></i>
            </button>
        </>
    );

    return (
        <div className="container-fluid py-4">
            <BaseModal isOpen={Boolean(selected)} title={selected ? `Reportes da questão ${selected.numeroQuestao || selected.codigoQuestao}` : ''} size="modal-lg" onClose={() => setSelected(null)}>
                {selected && (
                    <>
                        <p className="small text-body-secondary">{selected.nomeProva}{selected.materia ? ` · ${selected.materia}` : ''}</p>
                        <ul className="list-unstyled d-grid gap-3 mb-0">
                            {selected.reportes.map((reporte) => {
                                const reporteStatus = getStatus(reporte.status);
                                return (
                                    <li key={reporte.codigo} className="p-3 rounded bg-body-tertiary">
                                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-1">
                                            <div>
                                                <strong>{getMotivoLabel(reporte.motivo)}</strong>
                                                <span className={`badge ms-2 ${reporteStatus.className}`}>{reporteStatus.label}</span>
                                                <div className="small text-body-secondary">{reporte.nomeUsuario} · {putDateOnPattern(reporte.created)}</div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                {renderActions(getOpenCodes([reporte]))}
                                            </div>
                                        </div>
                                        {reporte.descricao && <p className="mb-0" style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>{reporte.descricao}</p>}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </BaseModal>
            <ConfirmModal
                isOpen={Boolean(action)}
                title="Atualizar reportes"
                message={action ? `Deseja ${ACTION_LABELS[action.status]} ${action.codigos.length} reporte(s) em aberto?` : ''}
                confirmData={action}
                onYes={handleUpdateStatus}
                onNo={() => setAction(null)}
            />
            <div className="mb-4">
                <h1 className="h3 mb-1">Reportes de questões</h1>
                <p className="text-body-secondary mb-0">Problemas reportados pelos usuários, agrupados por questão.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="row g-3 align-items-end mb-4">
                        <div className="col-lg-3 col-md-4">
                            <label htmlFor="status" className="form-label">Status</label>
                            <select id="status" className="form-select" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
                                {REPORT_STATUS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                                <option value="">Todos</option>
                            </select>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Questão</th>
                                    <th scope="col">Reportes</th>
                                    <th scope="col">Motivos</th>
                                    <th scope="col">Último reporte</th>
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center text-body-secondary py-4">Nenhum reporte encontrado.</td>
                                    </tr>
                                )}
                                {items.map((item) => (
                                    <tr key={item.codigoQuestao}>
                                        <td data-label="Questão">
                                            <div className="fw-semibold">Questão {item.numeroQuestao || item.codigoQuestao}</div>
                                            <div className="small text-body-secondary">{item.nomeProva}{item.materia ? ` · ${item.materia}` : ''}</div>
                                        </td>
                                        <td data-label="Reportes"><span className="badge rounded-pill text-bg-danger">{item.quantidade}</span></td>
                                        <td data-label="Motivos">
                                            <div className="d-flex flex-wrap gap-1">
                                                {countMotivos(item.reportes).map((motivo) => (
                                                    <span key={motivo.value} className="badge rounded-pill bg-body-secondary text-body border">{motivo.label} ({motivo.quantidade})</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td data-label="Último reporte" className="text-nowrap">{putDateOnPattern(item.ultimoReporte)}</td>
                                        <td className="table-actions text-end">
                                            <div className="d-inline-flex gap-2">
                                                <button type="button" className="btn btn-outline-secondary btn-sm" title="Visualizar" aria-label="Visualizar" onClick={() => setSelected(item)}>
                                                    <i className="bi bi-eye" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-primary btn-sm" title="Editar questão" aria-label="Editar questão" onClick={() => navigate(`/questoes/${item.codigoQuestao}/editar`)}>
                                                    <i className="bi bi-pencil" aria-hidden="true"></i>
                                                </button>
                                                {renderActions(getOpenCodes(item.reportes))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer bg-body border-0 d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <small className="text-body-secondary">Total de questões: {totalItens}</small>
                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    );
};

export default ReportesQuestoesListPage;
