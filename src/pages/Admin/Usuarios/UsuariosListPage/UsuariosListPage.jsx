import React, { useState, useEffect } from 'react';
import usuariosApi from '../../../../services/apiServices/usuariosApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../../services/configService';
import Pagination from '../../../../components/common/Pagination/Pagination';
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../../utils/functions';
import FilterComponent from '../../../../components/admin/FilterComponent/FilterComponent';
import BaseModal from '../../../../components/common/Modals/BaseModal/BaseModal';

const UsuariosListPage = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItens, setTotalItens] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const totalPages = Math.ceil(totalItens / quantity);

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await usuariosApi.getPaginated({ page, quantity, email: searchTerm || undefined });
                setItems(response.object || []);
                setTotalItens(response.total || 0);
            } catch {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, quantity, searchTerm, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const search = ({ term } = {}) => {
        setSearchTerm(term);
        setPage(1);
    };

    const resendEmail = async (email) => {
        dispatch(setLoading(true));
        try {
            const response = await usuariosApi.resendConfirmationEmail(email);
            if (response.success) {
                toast.success('Email reenviado!');
            } else {
                toast.warn('Não foi possível reenviar o email.');
            }
        } catch {
            toast.warn('Não foi possível reenviar o email.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const isVerified = (item) => `${item.isVerified}` === '1';

    return (
        <div className="container-fluid py-4">
            <BaseModal isOpen={Boolean(selected)} title="Usuário" onClose={() => setSelected(null)}>
                {selected && (
                    <dl className="row mb-0">
                        <dt className="col-sm-4 text-body-secondary">Id</dt>
                        <dd className="col-sm-8">{selected.Id}</dd>
                        <dt className="col-sm-4 text-body-secondary">Login</dt>
                        <dd className="col-sm-8">{selected.login ?? '-'}</dd>
                        <dt className="col-sm-4 text-body-secondary">Nome</dt>
                        <dd className="col-sm-8">{selected.nome ?? '-'}</dd>
                        <dt className="col-sm-4 text-body-secondary">Email</dt>
                        <dd className="col-sm-8">{selected.email ?? '-'}</dd>
                        <dt className="col-sm-4 text-body-secondary">Data de nascimento</dt>
                        <dd className="col-sm-8">{selected.dataNascimento ?? '-'}</dd>
                        <dt className="col-sm-4 text-body-secondary">Verificado</dt>
                        <dd className="col-sm-8">{isVerified(selected) ? 'Sim' : 'Não'}</dd>
                        <dt className="col-sm-4 text-body-secondary">Perfil</dt>
                        <dd className="col-sm-8">{selected.tipoPerfil?.descricao ?? '-'}</dd>
                        <dt className="col-sm-4 text-body-secondary">Instituição</dt>
                        <dd className="col-sm-8">{selected.instituicao ?? '-'}</dd>
                        <dt className="col-sm-4 text-body-secondary">Criado</dt>
                        <dd className="col-sm-8">{putDateOnPattern(selected.created) || '-'}</dd>
                        <dt className="col-sm-4 text-body-secondary">Atualizado</dt>
                        <dd className="col-sm-8">{putDateOnPattern(selected.updated) || '-'}</dd>
                    </dl>
                )}
            </BaseModal>
            <div className="mb-4">
                <h1 className="h3 mb-1">Usuários</h1>
                <p className="text-body-secondary mb-0">Usuários cadastrados no Questões Aqui.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <FilterComponent placeHolder="Email" showTermFilter={true} submitFilter={search} />
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Perfil</th>
                                    <th scope="col">Criado</th>
                                    <th scope="col">Verificado</th>
                                    <th scope="col" className="table-actions text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.Id}>
                                        <td data-label="Id">{item.Id}</td>
                                        <td data-label="Nome">{item.nome}</td>
                                        <td data-label="Email">{item.email}</td>
                                        <td data-label="Perfil">{item.tipoPerfil?.descricao}</td>
                                        <td data-label="Criado">{putDateOnPattern(item.created)}</td>
                                        <td data-label="Verificado">
                                            <span className={`badge ${isVerified(item) ? 'text-bg-success' : 'text-bg-secondary'}`}>
                                                {isVerified(item) ? 'Sim' : 'Não'}
                                            </span>
                                        </td>
                                        <td className="table-actions text-end">
                                            <div className="btn-group btn-group-sm" role="group" aria-label="Ações do registro">
                                                {!isVerified(item) && (
                                                    <button type="button" className="btn btn-outline-primary" title="Reenviar email de confirmação" aria-label="Reenviar email de confirmação" onClick={() => resendEmail(item.email)}>
                                                        <i className="bi bi-envelope" aria-hidden="true"></i>
                                                    </button>
                                                )}
                                                <button type="button" className="btn btn-outline-secondary" title="Visualizar" aria-label="Visualizar" onClick={() => setSelected(item)}>
                                                    <i className="bi bi-eye" aria-hidden="true"></i>
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

export default UsuariosListPage;
