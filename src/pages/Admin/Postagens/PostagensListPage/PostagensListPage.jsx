import React, { useState, useEffect } from 'react';
import postagemApi from '../../../../services/apiServices/postagemApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../../services/configService';
import Pagination from '../../../../components/common/Pagination/Pagination';
import ConfirmModal from '../../../../components/common/Modals/ConfirmModal/ConfirmModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getTipoPostagemLabel, tiposPostagem } from '../postagemFields';

const PostagensListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [page, setPage] = useState(1);
    const [tipoPostagem, setTipoPostagem] = useState(0);
    const [totalItens, setTotalItens] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const totalPages = Math.ceil(totalItens / quantity);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await postagemApi.getPaginated({ page, quantity, tipoPostagem });
                if (!response.success) {
                    toast.error(response.message || 'Erro ao buscar os itens.');
                    return;
                }
                setItems(response.object || []);
                setTotalItens(response.total || 0);
            } catch {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, quantity, tipoPostagem, dispatch, refresh]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleTipoChange = (event) => {
        setTipoPostagem(Number(event.target.value));
        setPage(1);
    };

    const deleteItem = async (item) => {
        setItemToDelete(null);
        dispatch(setLoading(true));
        try {
            const response = await postagemApi.delete(item.id);
            if (response.success && response.object) {
                toast.info('Deletado com sucesso!');
                setRefresh(prev => prev + 1);
            } else {
                toast.error('Erro ao deletar');
            }
        } catch {
            toast.error('Erro ao deletar');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-fluid py-4">
            <ConfirmModal isOpen={Boolean(itemToDelete)} title="Excluir postagem" message={`Deseja excluir a postagem #${itemToDelete?.id} (${itemToDelete?.titulo})?`} confirmData={itemToDelete} onYes={deleteItem} onNo={() => setItemToDelete(null)} />
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Postagens</h1>
                    <p className="text-body-secondary mb-0">Gerencie as postagens do portfolio.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => navigate('novo')}>
                    <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
                    Novo
                </button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <label htmlFor="filtroTipoPostagem" className="form-label">Tipo</label>
                            <select id="filtroTipoPostagem" className="form-select" value={tipoPostagem} onChange={handleTipoChange}>
                                {tiposPostagem.map((tipo) => (
                                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Capa</th>
                                    <th scope="col">Título</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col">Curtidas</th>
                                    <th scope="col">Criada em</th>
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td data-label="Id">{item.id}</td>
                                        <td data-label="Capa">{item.capa && <img src={item.capa} alt="" width="64" height="40" className="rounded object-fit-cover" loading="lazy" />}</td>
                                        <td data-label="Título">{item.titulo}</td>
                                        <td data-label="Tipo">{getTipoPostagemLabel(item.tipoPostagem)}</td>
                                        <td data-label="Curtidas">{item.curtidas}</td>
                                        <td data-label="Criada em">{item.created ? new Date(item.created).toLocaleDateString('pt-BR') : ''}</td>
                                        <td className="table-actions text-end">
                                            <div className="btn-group btn-group-sm" role="group" aria-label="Ações do registro">
                                                <button type="button" className="btn btn-outline-primary" title="Editar" aria-label="Editar" onClick={() => navigate(`${item.id}/editar`)}>
                                                    <i className="bi bi-pencil" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-danger" title="Excluir" aria-label="Excluir" onClick={() => setItemToDelete(item)}>
                                                    <i className="bi bi-trash" aria-hidden="true"></i>
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

export default PostagensListPage;
