import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../../services/redux/loadingSlice';
import publicQuestoesApi from '../../../../services/apiServices/publicQuestoesApi';
import Pagination from '../../../../components/common/Pagination/Pagination';
import QuestionListItem from '../../../../components/client/QuestionListItem/QuestionListItem';

const QUANTITY = 10;

const ProvaQuestoesPage = () => {
    const { provaId } = useParams();
    const dispatch = useDispatch();
    const [prova, setProva] = useState(null);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const totalPages = Math.ceil(totalItens / QUANTITY);

    useEffect(() => {
        const fetchProva = async () => {
            try {
                const response = await publicQuestoesApi.getProvaById(provaId);
                setProva(response.object || null);
            } catch {
                toast.error('Erro ao buscar a prova.');
            }
        };
        fetchProva();
    }, [provaId]);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await publicQuestoesApi.getQuestoesPaginated({ page, quantity: QUANTITY, anexos: false, codigoProva: provaId });
                setItems(response.object || []);
                setTotalItens(response.total || 0);
            } catch {
                toast.error('Erro ao buscar as questões.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, provaId, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <>
            <Link to="/provas" className="link-secondary small d-inline-block mb-3">
                <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>Provas
            </Link>
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <h1 className="h4 mb-1">{prova?.nomeProva || 'Prova'}</h1>
                        <p className="text-body-secondary small mb-0">
                            {[prova?.banca, prova?.local, prova?.dataAplicacao].filter(Boolean).join(' · ')}
                            {totalItens > 0 && ` · ${totalItens} questões`}
                        </p>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        <Link to={`/praticar?codigoProva=${provaId}`} className="btn btn-outline-primary">Resolver em sequência</Link>
                        <Link to={`/simulados/prova/${provaId}`} className="btn btn-primary">Fazer simulado</Link>
                    </div>
                </div>
            </div>

            <div className="d-grid gap-3">
                {items.map((item, index) => (
                    <QuestionListItem key={item.Id} questao={item} answerUrl={`/praticar?codigoProva=${provaId}&inicio=${(page - 1) * QUANTITY + index + 1}`} />
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

export default ProvaQuestoesPage;
