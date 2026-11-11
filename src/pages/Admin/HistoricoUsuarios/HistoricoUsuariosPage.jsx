import React, { useState, useEffect } from 'react';
import usuariosApi from '../../../services/apiServices/usuariosApi';
import respostasusuariosApi from '../../../services/apiServices/respostasusuariosApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import Pagination from '../../../components/common/Pagination/Pagination';
import { toast } from 'react-toastify';
import { downloadFromLink, putDateOnPattern } from '../../../utils/functions';
import { useNavigate } from 'react-router-dom';

const quantity = 10;

const HistoricoUsuariosPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [usuarios, setUsuarios] = useState([]);
    const [userCode, setUserCode] = useState('');
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const totalPages = Math.ceil(totalItens / quantity);
    const usuario = usuarios.find((item) => `${item.Id}` === userCode);

    useEffect(() => {
        const fetchUsuarios = async () => {
            dispatch(setLoading(true));
            try {
                const response = await usuariosApi.getAll();
                setUsuarios([...(response.object || [])].sort((a, b) => `${a.nome}`.localeCompare(`${b.nome}`)));
            } catch {
                toast.error('Erro ao buscar os usuários.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchUsuarios();
    }, [dispatch]);

    useEffect(() => {
        if (!userCode) {
            return;
        }

        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await respostasusuariosApi.getHistory({ page, quantity, userCode });
                setItems(response.object || []);
                setTotalItens(response.total || 0);
            } catch {
                toast.error('Erro ao buscar o histórico.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, userCode, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const downloadReport = async () => {
        dispatch(setLoading(true));
        try {
            const response = await respostasusuariosApi.getReportDetail(userCode);
            if (response.success) {
                downloadFromLink(response.object, `Histórico - ${usuario?.nome}.html`);
            } else {
                toast.error('Histórico não encontrado');
            }
        } catch {
            toast.error('Erro ao gerar o histórico!');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h1 className="h3 mb-1">Histórico de usuários</h1>
                <p className="text-body-secondary mb-0">Últimas respostas de um usuário.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="row g-3 align-items-end mb-4">
                        <div className="col-lg-6">
                            <label htmlFor="usuario" className="form-label">Usuário</label>
                            <select id="usuario" className="form-select" value={userCode} onChange={(event) => { setUserCode(event.target.value); setPage(1); setItems([]); setTotalItens(0); }}>
                                <option value="">Selecione</option>
                                {usuarios.map((item) => <option key={item.Id} value={item.Id}>{item.nome} ({item.email})</option>)}
                            </select>
                        </div>
                        <div className="col-lg-3 col-md-6 d-grid">
                            <button type="button" className="btn btn-outline-secondary" onClick={downloadReport} disabled={!userCode}>
                                <i className="bi bi-download me-2" aria-hidden="true"></i>
                                Histórico detalhado
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Prova</th>
                                    <th scope="col">Questão</th>
                                    <th scope="col">Resposta</th>
                                    <th scope="col">Data</th>
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td data-label="Prova">{item.nomeProva}</td>
                                        <td data-label="Questão">{item.numeroQuestao}</td>
                                        <td data-label="Resposta">
                                            <span className={`badge ${item.respostaCorreta === '1' ? 'text-bg-success' : 'text-bg-danger'}`}>
                                                {item.respostaCorreta === '1' ? 'Correta' : 'Incorreta'}
                                            </span>
                                        </td>
                                        <td data-label="Data">{putDateOnPattern(item.dataResposta)}</td>
                                        <td className="table-actions text-end">
                                            <button type="button" className="btn btn-outline-secondary btn-sm" title="Visualizar questão" aria-label="Visualizar questão" onClick={() => navigate(`/questoes/${item.codigoQuestao}/editar`)}>
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

export default HistoricoUsuariosPage;
