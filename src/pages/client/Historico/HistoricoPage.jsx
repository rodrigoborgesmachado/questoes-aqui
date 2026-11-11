import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../services/redux/loadingSlice';
import respostasusuariosApi from '../../../services/apiServices/respostasusuariosApi';
import Pagination from '../../../components/common/Pagination/Pagination';
import { putDateOnPattern } from '../../../utils/functions';

const QUANTITY = 15;

const HistoricoPage = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const totalPages = Math.ceil(totalItens / QUANTITY);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await respostasusuariosApi.getHistory({ page, quantity: QUANTITY });
                setItems(response.object || []);
                setTotalItens(response.total || 0);
            } catch {
                toast.error('Erro ao buscar o histórico.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <>
            <div className="mb-4">
                <h1 className="h3 mb-1">Histórico de respostas</h1>
                <p className="text-body-secondary mb-0">{totalItens} respostas registradas. Revise as questões para fixar o conteúdo.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="list-group list-group-flush">
                    {items.map((item, index) => (
                        <div key={`${item.codigo}-${index}`} className="list-group-item bg-transparent d-flex flex-wrap justify-content-between align-items-center gap-2 py-3">
                            <div className="d-flex align-items-center gap-3">
                                <i className={`bi fs-4 ${item.respostaCorreta === '1' ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`} aria-label={item.respostaCorreta === '1' ? 'Correta' : 'Incorreta'}></i>
                                <div>
                                    <strong className="d-block">{item.nomeProva}</strong>
                                    <span className="small text-body-secondary">Questão {item.numeroQuestao} · {putDateOnPattern(item.dataResposta)}</span>
                                </div>
                            </div>
                            <Link to={`/praticar?id=${item.codigoQuestao}`} className="btn btn-outline-secondary btn-sm">Responder de novo</Link>
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-body-secondary p-4 mb-0">Você ainda não respondeu nenhuma questão.</p>}
                </div>
                {totalPages > 1 && (
                    <div className="card-footer bg-body border-0 d-flex justify-content-end">
                        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>
        </>
    );
};

export default HistoricoPage;
