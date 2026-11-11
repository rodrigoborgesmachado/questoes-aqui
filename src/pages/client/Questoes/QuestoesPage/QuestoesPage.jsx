import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../../services/redux/loadingSlice';
import provaApi from '../../../../services/apiServices/provaApi';
import publicQuestoesApi from '../../../../services/apiServices/publicQuestoesApi';
import Pagination from '../../../../components/common/Pagination/Pagination';
import QuestionListItem from '../../../../components/client/QuestionListItem/QuestionListItem';

const QUANTITY = 10;

const QuestoesPage = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const [options, setOptions] = useState({ materias: [], bancas: [], tipos: [] });
    const [filters, setFilters] = useState({ materias: '', bancas: '', tipos: '' });
    const totalPages = Math.ceil(totalItens / QUANTITY);
    const activeFilters = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const practiceUrl = `/praticar?${new URLSearchParams(activeFilters).toString()}`;

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [materias, bancas, tipos] = await Promise.all([provaApi.getAllMaterias(), provaApi.getAllBancas(), provaApi.getAllTipos()]);
                setOptions({ materias: materias.object || [], bancas: bancas.object || [], tipos: tipos.object || [] });
            } catch {
                toast.error('Erro ao buscar os filtros.');
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await publicQuestoesApi.getQuestoesPaginated({
                    page,
                    quantity: QUANTITY,
                    anexos: false,
                    materias: filters.materias || undefined,
                    bancas: filters.bancas || undefined,
                    tipos: filters.tipos || undefined,
                });
                setItems(response.object || []);
                setTotalItens(response.total || 0);
            } catch {
                toast.error('Erro ao buscar as questões.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, filters, dispatch]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((previous) => ({ ...previous, [name]: value }));
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <>
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Banco de questões</h1>
                    <p className="text-body-secondary mb-0">{totalItens} questões encontradas.</p>
                </div>
                <Link to={practiceUrl} className="btn btn-primary">
                    <i className="bi bi-play-fill me-1" aria-hidden="true"></i>
                    Praticar com estes filtros
                </Link>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body row g-3">
                    <div className="col-md-4">
                        <label htmlFor="materias" className="form-label small">Matéria</label>
                        <select id="materias" name="materias" className="form-select" value={filters.materias} onChange={handleFilterChange}>
                            <option value="">Todas</option>
                            {options.materias.map((materia) => <option key={materia} value={materia}>{materia}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="bancas" className="form-label small">Banca</label>
                        <select id="bancas" name="bancas" className="form-select" value={filters.bancas} onChange={handleFilterChange}>
                            <option value="">Todas</option>
                            {options.bancas.map((banca) => <option key={banca} value={banca}>{banca}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="tipos" className="form-label small">Tipo de prova</label>
                        <select id="tipos" name="tipos" className="form-select" value={filters.tipos} onChange={handleFilterChange}>
                            <option value="">Todos</option>
                            {options.tipos.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="d-grid gap-3">
                {items.map((item) => (
                    <QuestionListItem key={item.Id} questao={item} answerUrl={`/praticar?id=${item.Id}`} />
                ))}
            </div>

            {items.length === 0 && <p className="text-body-secondary">Nenhuma questão encontrada.</p>}

            {totalPages > 1 && (
                <div className="d-flex justify-content-end mt-4">
                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            )}
        </>
    );
};

export default QuestoesPage;
