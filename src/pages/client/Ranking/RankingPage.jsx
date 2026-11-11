import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoading } from '../../../services/redux/loadingSlice';
import respostasusuariosApi from '../../../services/apiServices/respostasusuariosApi';
import { selectUserName } from '../../../services/redux/authSlice';

const MEDALS = ['text-warning', 'text-secondary', 'text-danger-emphasis'];

const RankingPage = () => {
    const dispatch = useDispatch();
    const userName = useSelector(selectUserName);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await respostasusuariosApi.getRanking();
                setItems(response.object || []);
            } catch {
                toast.error('Erro ao buscar o ranking.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [dispatch]);

    return (
        <div className="mx-auto" style={{ maxWidth: '760px' }}>
            <div className="mb-4">
                <h1 className="h3 mb-1">Ranking</h1>
                <p className="text-body-secondary mb-0">Usuários com mais questões respondidas corretamente.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <ol className="list-group list-group-flush">
                    {items.map((item, index) => (
                        <li key={`${item.login}-${index}`} className={`list-group-item d-flex align-items-center gap-3 py-3 ${item.nome === userName ? 'list-group-item-success' : 'bg-transparent'}`}>
                            <span className="fw-semibold text-center" style={{ width: '2.5rem' }}>
                                {index < 3 ? <i className={`bi bi-trophy-fill fs-4 ${MEDALS[index]}`} aria-label={`${index + 1}º lugar`}></i> : `${index + 1}º`}
                            </span>
                            <span className="flex-grow-1 text-truncate">{item.nome}{item.nome === userName && <span className="badge text-bg-success ms-2">Você</span>}</span>
                            <span className="fw-semibold">{item.quantidade} <span className="small text-body-secondary fw-normal">acertos</span></span>
                        </li>
                    ))}
                    {items.length === 0 && <li className="list-group-item bg-transparent text-body-secondary p-4">Ranking indisponível no momento.</li>}
                </ol>
            </div>
        </div>
    );
};

export default RankingPage;
