import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../../services/redux/loadingSlice';
import provaApi from '../../../../services/apiServices/provaApi';
import publicQuestoesApi from '../../../../services/apiServices/publicQuestoesApi';
import Pagination from '../../../../components/common/Pagination/Pagination';

const QUANTITY = 12;

const ProvasPage = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [searchParams, setSearchParams] = useSearchParams();
    const bancasFilter = searchParams.get('bancas') || '';
    const tiposFilter = searchParams.get('tipos') || '';
    const requestedPage = Number(searchParams.get('page'));
    const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const [items, setItems] = useState([]);
    const [totalItens, setTotalItens] = useState(0);
    const [bancas, setBancas] = useState([]);
    const [tipos, setTipos] = useState([]);
    const totalPages = Math.ceil(totalItens / QUANTITY);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [bancasResponse, tiposResponse] = await Promise.all([provaApi.getAllBancas(), provaApi.getAllTipos()]);
                setBancas(bancasResponse.object || []);
                setTipos(tiposResponse.object || []);
            } catch {
                toast.error('Erro ao buscar os filtros.');
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        const lifecycle = new AbortController();
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const params = { page, quantity: QUANTITY, bancas: bancasFilter || undefined, tipos: tiposFilter || undefined };
                const response = isAuthenticated ? await provaApi.getPaginated(params) : await publicQuestoesApi.getProvasPaginated(params);
                if (!lifecycle.signal.aborted) {
                    setItems(response.object || []);
                    setTotalItens(response.total || 0);
                }
            } catch {
                if (!lifecycle.signal.aborted) {
                    toast.error('Erro ao buscar as provas.');
                }
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
        return () => { lifecycle.abort(); };
    }, [page, bancasFilter, tiposFilter, isAuthenticated, dispatch]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setSearchParams((previous) => {
            const next = new URLSearchParams(previous);
            if (value) {
                next.set(name, value);
            } else {
                next.delete(name);
            }
            next.delete('page');
            return next;
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setSearchParams((previous) => {
                const next = new URLSearchParams(previous);
                next.set('page', `${newPage}`);
                return next;
            });
        }
    };

    return (
        <>
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Provas</h1>
                    <p className="text-body-secondary mb-0">Escolha uma prova para ver as questões, resolver ou fazer um simulado.</p>
                </div>
                <div className="d-flex flex-wrap gap-2">
                    <select name="bancas" className="form-select" value={bancasFilter} onChange={handleFilterChange} aria-label="Filtrar por banca">
                        <option value="">Todas as bancas</option>
                        {bancas.map((banca) => <option key={banca} value={banca}>{banca}</option>)}
                    </select>
                    <select name="tipos" className="form-select" value={tiposFilter} onChange={handleFilterChange} aria-label="Filtrar por tipo">
                        <option value="">Todos os tipos</option>
                        {tipos.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                    </select>
                </div>
            </div>

            <div className="row g-3">
                {items.map((item) => {
                    const total = item.quantidadeQuestoesTotal || 0;
                    const resolvidas = item.quantidadeQuestoesResolvidas || 0;
                    const progress = total > 0 ? Math.round((resolvidas / total) * 100) : 0;
                    return (
                        <div key={item.Id} className="col-md-6 col-xl-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex flex-wrap gap-1 mb-2">
                                        {item.tipoProvaAssociado?.map((tipo) => (
                                            <span key={tipo.tipoProva?.descricao} className="badge rounded-pill question-badge">{tipo.tipoProva?.descricao}</span>
                                        ))}
                                    </div>
                                    <h2 className="h6 mb-2">{item.nomeProva}</h2>
                                    <ul className="list-unstyled small text-body-secondary mb-3">
                                        {item.banca && <li><i className="bi bi-building me-2" aria-hidden="true"></i>{item.banca}</li>}
                                        {item.local && <li><i className="bi bi-geo-alt me-2" aria-hidden="true"></i>{item.local}</li>}
                                        {item.dataAplicacao && <li><i className="bi bi-calendar-event me-2" aria-hidden="true"></i>{item.dataAplicacao}</li>}
                                        <li><i className="bi bi-list-ol me-2" aria-hidden="true"></i>{total} questões</li>
                                    </ul>
                                    {isAuthenticated && (
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between small mb-1">
                                                <span>Seu progresso</span>
                                                <span>{resolvidas}/{total}</span>
                                            </div>
                                            <div className="progress client-progress" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                                                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="d-flex flex-wrap gap-2 mt-auto">
                                        <Link to={`/provas/${item.Id}`} className="btn btn-outline-secondary btn-sm">Ver questões</Link>
                                        <Link to={`/praticar?codigoProva=${item.Id}`} className="btn btn-outline-primary btn-sm">Resolver</Link>
                                        <Link to={`/simulados/prova/${item.Id}`} className="btn btn-primary btn-sm">Simulado</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {items.length === 0 && <p className="text-body-secondary">Nenhuma prova encontrada.</p>}

            {totalPages > 1 && (
                <div className="d-flex justify-content-end mt-4">
                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            )}
        </>
    );
};

export default ProvasPage;
