import React, { useState, useEffect } from 'react';
import questoesApi from '../../../../services/apiServices/questoesApi';
import provaApi from '../../../../services/apiServices/provaApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../../services/configService';
import Pagination from '../../../../components/common/Pagination/Pagination';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const QuestoesListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { provaId } = useParams();
    const [items, setItems] = useState([]);
    const [prova, setProva] = useState(null);
    const [page, setPage] = useState(1);
    const [materia, setMateria] = useState('');
    const [banca, setBanca] = useState('');
    const [materias, setMaterias] = useState([]);
    const [bancas, setBancas] = useState([]);
    const [totalItens, setTotalItens] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const totalPages = Math.ceil(totalItens / quantity);

    useEffect(() => {
        if (provaId) {
            return;
        }

        const fetchFilters = async () => {
            try {
                const [materiasResponse, bancasResponse] = await Promise.all([provaApi.getAllMaterias(), provaApi.getAllBancas()]);
                setMaterias(materiasResponse.object || []);
                setBancas(bancasResponse.object || []);
            } catch {
                toast.error('Erro ao buscar os filtros.');
            }
        };
        fetchFilters();
    }, [provaId]);

    useEffect(() => {
        if (!provaId) {
            return;
        }

        const fetchProva = async () => {
            try {
                const response = await provaApi.getById(provaId);
                setProva(response.object);
            } catch {
                toast.error('Erro ao buscar a prova.');
            }
        };
        fetchProva();
    }, [provaId, refresh]);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const filters = provaId ? { codigoProva: provaId } : { materias: materia || undefined, bancas: banca || undefined };
                const response = await questoesApi.getPaginated({ page, quantity, anexos: false, ...filters });
                const list = response.object || [];
                setItems(provaId ? [...list].sort((a, b) => parseInt(a.numeroQuestao, 10) - parseInt(b.numeroQuestao, 10)) : list);
                setTotalItens(response.total || 0);
            } catch {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, quantity, provaId, materia, banca, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const changeStatus = async () => {
        dispatch(setLoading(true));
        try {
            const response = await provaApi.updateStatus(prova.Id, prova.isActive !== '1');
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
                    <h1 className="h3 mb-1">{provaId ? `Questões - ${prova?.nomeProva ?? ''}` : 'Questões'}</h1>
                    <p className="text-body-secondary mb-0">
                        {provaId ? `${prova?.banca ?? ''} ${prova?.dataAplicacao ?? ''}` : 'Todas as questões cadastradas.'}
                        {prova && (
                            <span className={`badge ms-2 ${prova.isActive === '1' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                                {prova.isActive === '1' ? 'Ativo' : 'Desativado'}
                            </span>
                        )}
                    </p>
                </div>
                {provaId && (
                    <div className="d-flex flex-wrap gap-2">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/provas')}>Voltar</button>
                        {prova && (
                            <button type="button" className={prova.isActive === '1' ? 'btn btn-outline-danger' : 'btn btn-outline-success'} onClick={changeStatus}>
                                {prova.isActive === '1' ? 'Desativar' : 'Ativar'}
                            </button>
                        )}
                        <button type="button" className="btn btn-primary" onClick={() => navigate(`novo?numero=${totalItens + 1}`)}>
                            <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
                            Adicionar
                        </button>
                    </div>
                )}
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    {!provaId && (
                        <div className="row g-3 align-items-end mb-4">
                            <div className="col-lg-4 col-md-6">
                                <label htmlFor="materia" className="form-label">Matéria</label>
                                <select id="materia" className="form-select" value={materia} onChange={(event) => { setMateria(event.target.value); setPage(1); }}>
                                    <option value="">Todas</option>
                                    {materias.map((item) => <option key={item} value={item}>{item}</option>)}
                                </select>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <label htmlFor="banca" className="form-label">Banca</label>
                                <select id="banca" className="form-select" value={banca} onChange={(event) => { setBanca(event.target.value); setPage(1); }}>
                                    <option value="">Todas</option>
                                    {bancas.map((item) => <option key={item} value={item}>{item}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Código</th>
                                    <th scope="col">Nº Questão</th>
                                    <th scope="col">Matéria</th>
                                    <th scope="col">Assunto</th>
                                    {!provaId && <th scope="col">Prova</th>}
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.Id}>
                                        <td data-label="Código">{item.Id}</td>
                                        <td data-label="Nº Questão">{item.numeroQuestao}</td>
                                        <td data-label="Matéria">{item.materia}</td>
                                        <td data-label="Assunto">{item.assunto}</td>
                                        {!provaId && <td data-label="Prova">{item.prova?.nomeProva}</td>}
                                        <td className="table-actions text-end">
                                            <button type="button" className="btn btn-outline-primary btn-sm" title="Editar" aria-label="Editar" onClick={() => navigate(`/questoes/${item.Id}/editar`)}>
                                                <i className="bi bi-pencil" aria-hidden="true"></i>
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

export default QuestoesListPage;
