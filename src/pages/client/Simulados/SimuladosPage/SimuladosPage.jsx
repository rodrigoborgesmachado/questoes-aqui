import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../../services/redux/loadingSlice';
import simuladoApi from '../../../../services/apiServices/simuladoApi';
import { putDateOnPattern } from '../../../../utils/functions';

const QUANTITY = 10;

const SimuladosPage = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await simuladoApi.getPaginated({ page, quantity: QUANTITY });
                setItems(response.object || []);
            } catch {
                toast.error('Erro ao buscar os simulados.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, dispatch]);

    return (
        <>
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Simulados</h1>
                    <p className="text-body-secondary mb-0">Resolva uma prova completa com cronômetro e veja seu resultado no final.</p>
                </div>
                <Link to="/provas" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1" aria-hidden="true"></i>Novo simulado
                </Link>
            </div>

            <h2 className="h5 mb-3">Meus simulados</h2>
            <div className="row g-3">
                {items.map((item) => {
                    const percentual = item.quantidadeQuestoes > 0 ? Math.round((item.quantidadeCertas / item.quantidadeQuestoes) * 100) : 0;
                    return (
                        <div key={item.codigo} className="col-md-6 col-xl-4">
                            <Link to={`/simulados/resultado/${item.codigo}`} className="card border-0 shadow-sm h-100 text-decoration-none client-action-card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                        <h3 className="h6 mb-0">{item.prova?.nomeProva}</h3>
                                        <span className="fs-5 fw-semibold text-app-primary">{percentual}%</span>
                                    </div>
                                    <p className="small text-body-secondary mb-0">
                                        {item.quantidadeCertas}/{item.quantidadeQuestoes} acertos · {Math.max(Math.round((item.tempo || 0) / 60), 1)} min
                                        <br />
                                        {putDateOnPattern(item.created)}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {items.length === 0 && page === 1 && (
                <div className="card border-0 shadow-sm text-center">
                    <div className="card-body p-5">
                        <i className="bi bi-stopwatch display-5 text-app-primary" aria-hidden="true"></i>
                        <p className="mt-3 mb-3">Você ainda não fez nenhum simulado.</p>
                        <Link to="/provas" className="btn btn-primary">Escolher uma prova</Link>
                    </div>
                </div>
            )}

            {(page > 1 || items.length === QUANTITY) && (
                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setPage(page - 1)} disabled={page <= 1}>Anterior</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setPage(page + 1)} disabled={items.length < QUANTITY}>Próximo</button>
                </div>
            )}
        </>
    );
};

export default SimuladosPage;
