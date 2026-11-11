import React, { useState, useEffect } from 'react';
import provaApi from '../../../../services/apiServices/provaApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../../services/configService';
import Pagination from '../../../../components/common/Pagination/Pagination';
import { toast } from 'react-toastify';
import { downloadFromLink, putDateOnPattern } from '../../../../utils/functions';
import { useNavigate } from 'react-router-dom';

const ProvaListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [banca, setBanca] = useState('');
    const [tipo, setTipo] = useState('');
    const [bancas, setBancas] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [totalItens, setTotalItens] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const totalPages = Math.ceil(totalItens / quantity);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [bancasResponse, tiposResponse] = await Promise.all([provaApi.getAllBancas(), provaApi.getAllTipos()]);
                setBancas(bancasResponse.object || []);
                setTipos(tiposResponse.object || []);
            } catch {
                toast.error('Erro ao buscar os filtros.');
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await provaApi.getPaginated({ page, quantity, bancas: banca || undefined, tipos: tipo || undefined });
                setItems(response.object || []);
                setTotalItens(response.total || 0);
            } catch {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, quantity, banca, tipo, dispatch, refresh]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const download = async (item, isProva) => {
        dispatch(setLoading(true));
        try {
            const response = isProva ? await provaApi.downloadProva(item.Id) : await provaApi.downloadGabarito(item.Id);
            if (response.success) {
                downloadFromLink(response.object, `${isProva ? 'Prova' : 'Gabarito'} ${item.nomeProva.replace('/', '').replace('-', ' ')}.html`);
            } else {
                toast.error(`${isProva ? 'Prova' : 'Gabarito'} não encontrada`);
            }
        } catch {
            toast.error('Erro ao gerar o arquivo!');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const changeStatus = async (item) => {
        dispatch(setLoading(true));
        try {
            const response = await provaApi.updateStatus(item.Id, item.isActive !== '1');
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
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Provas</h1>
                    <p className="text-body-secondary mb-0">Gerencie as provas e suas questões.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => navigate('novo')}>
                    <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
                    Novo
                </button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="row g-3 align-items-end mb-4">
                        <div className="col-lg-4 col-md-6">
                            <label htmlFor="banca" className="form-label">Banca</label>
                            <select id="banca" className="form-select" value={banca} onChange={(event) => { setBanca(event.target.value); setPage(1); }}>
                                <option value="">Todas</option>
                                {bancas.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <label htmlFor="tipo" className="form-label">Tipo</label>
                            <select id="tipo" className="form-select" value={tipo} onChange={(event) => { setTipo(event.target.value); setPage(1); }}>
                                <option value="">Todos</option>
                                {tipos.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Código</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Banca</th>
                                    <th scope="col">Tipos</th>
                                    <th scope="col">Questões</th>
                                    <th scope="col">Data de Registro</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.Id}>
                                        <td data-label="Código">{item.Id}</td>
                                        <td data-label="Nome">{item.nomeProva}</td>
                                        <td data-label="Banca">{item.banca}</td>
                                        <td data-label="Tipos">{item.tipoProvaAssociado?.map((tipoAssociado) => tipoAssociado.tipoProva?.descricao).join(', ')}</td>
                                        <td data-label="Questões">{item.quantidadeQuestoesTotal}</td>
                                        <td data-label="Data de Registro">{putDateOnPattern(item.dataRegistro)}</td>
                                        <td data-label="Status">
                                            <span className={`badge ${item.isActive === '1' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                                                {item.isActive === '1' ? 'Ativo' : 'Desativado'}
                                            </span>
                                        </td>
                                        <td className="table-actions text-end">
                                            <div className="btn-group btn-group-sm" role="group" aria-label="Ações do registro">
                                                <button type="button" className="btn btn-outline-secondary" title="Questões" aria-label="Questões" onClick={() => navigate(`${item.Id}/questoes`)}>
                                                    <i className="bi bi-list-ol" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-primary" title="Editar" aria-label="Editar" onClick={() => navigate(`${item.Id}/editar`)}>
                                                    <i className="bi bi-pencil" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-secondary" title="Baixar prova" aria-label="Baixar prova" onClick={() => download(item, true)}>
                                                    <i className="bi bi-file-earmark-arrow-down" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-secondary" title="Baixar gabarito" aria-label="Baixar gabarito" onClick={() => download(item, false)}>
                                                    <i className="bi bi-file-earmark-check" aria-hidden="true"></i>
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

export default ProvaListPage;
