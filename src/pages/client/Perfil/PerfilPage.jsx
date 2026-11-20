import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import compressionLibraryUrl from 'browser-image-compression/dist/browser-image-compression.js?url';
import { setLoading } from '../../../services/redux/loadingSlice';
import { setFoto, setName } from '../../../services/redux/authSlice';
import usuariosApi from '../../../services/apiServices/usuariosApi';
import StatCard from '../../../components/client/StatCard/StatCard';
import { putDateOnPatternOnlyDate } from '../../../utils/functions';
import { stringToHash } from '../../../utils/passwordHash';

const emptyPasswords = { atual: '', nova: '', confirmar: '' };

const PerfilPage = () => {
    const dispatch = useDispatch();
    const [perfil, setPerfil] = useState(null);
    const [form, setForm] = useState({ nome: '', instituicao: '' });
    const [senhas, setSenhas] = useState(emptyPasswords);
    const fotoInputRef = useRef(null);

    useEffect(() => {
        const fetchPerfil = async () => {
            dispatch(setLoading(true));
            try {
                const response = await usuariosApi.getPerfil();
                if (response.success) {
                    setPerfil(response.object);
                    setForm({ nome: response.object.usuario?.nome || '', instituicao: response.object.usuario?.instituicao || '' });
                    dispatch(setFoto(response.object.usuario?.foto));
                }
            } catch {
                toast.error('Erro ao buscar o perfil.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchPerfil();
    }, [dispatch]);

    const handleSave = async (event) => {
        event.preventDefault();
        dispatch(setLoading(true));
        try {
            if (form.nome !== (perfil.usuario?.nome || '')) {
                const response = await usuariosApi.updateName(form.nome);
                if (!response.success) {
                    toast.error('Erro ao atualizar o nome.');
                    return;
                }
                dispatch(setName(form.nome));
            }
            if (form.instituicao !== (perfil.usuario?.instituicao || '')) {
                const response = await usuariosApi.updateInstituicao(form.instituicao);
                if (!response.success) {
                    toast.error('Erro ao atualizar a instituição.');
                    return;
                }
            }
            setPerfil((previous) => ({ ...previous, usuario: { ...previous.usuario, ...form } }));
            toast.success('Perfil atualizado!');
        } catch {
            toast.error('Erro ao atualizar o perfil.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleFotoChange = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) {
            return;
        }
        if (!file.type.startsWith('image/')) {
            toast.error('Selecione uma imagem.');
            return;
        }
        dispatch(setLoading(true));
        try {
            const compressed = await imageCompression(file, {
                useWebWorker: true,
                libURL: new URL(compressionLibraryUrl, window.location.href).href,
                maxWidthOrHeight: 512,
                initialQuality: 0.8,
                fileType: 'image/webp',
                preserveExif: false,
            });
            const response = await usuariosApi.updateFoto(await imageCompression.getDataUrlFromFile(compressed));
            if (!response.success) {
                toast.error(response.message || 'Erro ao atualizar a foto.');
                return;
            }
            setPerfil((previous) => ({ ...previous, usuario: { ...previous.usuario, foto: response.object.foto } }));
            dispatch(setFoto(response.object.foto));
            toast.success('Foto atualizada!');
        } catch {
            toast.error('Erro ao atualizar a foto.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        if (senhas.nova !== senhas.confirmar) {
            toast.error('As senhas não coincidem.');
            return;
        }
        dispatch(setLoading(true));
        try {
            const response = await usuariosApi.updateSenha(stringToHash(senhas.atual), stringToHash(senhas.nova));
            if (response.success) {
                toast.success('Senha atualizada!');
                setSenhas(emptyPasswords);
            } else {
                toast.error('Senha atual incorreta.');
            }
        } catch {
            toast.error('Erro ao atualizar a senha.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (!perfil) {
        return null;
    }

    const resolvidas = perfil.quantidadeQuestoesResolvidas || 0;
    const acertadas = perfil.quantidadeQuestoesAcertadas || 0;

    return (
        <>
            <div className="d-flex align-items-center gap-3 mb-4">
                <button type="button" className="client-icon-circle fs-3 border-0 p-0 position-relative" style={{ width: '64px', height: '64px' }} onClick={() => fotoInputRef.current?.click()} aria-label="Alterar foto" title="Alterar foto">
                    {perfil.usuario?.foto ? (
                        <img src={perfil.usuario.foto} alt="" className="rounded-circle w-100 h-100" style={{ objectFit: 'cover' }} />
                    ) : (
                        <i className="bi bi-person" aria-hidden="true"></i>
                    )}
                    <span className="position-absolute bottom-0 end-0 badge rounded-pill bg-primary border border-2 border-body fs-6 p-1 lh-1">
                        <i className="bi bi-camera" aria-hidden="true"></i>
                    </span>
                </button>
                <input ref={fotoInputRef} type="file" accept="image/*" className="d-none" onChange={handleFotoChange} />
                <div>
                    <h1 className="h3 mb-0">{perfil.usuario?.nome}</h1>
                    <span className="text-body-secondary">{perfil.usuario?.email}</span>
                    {perfil.usuario?.created && <span className="text-body-secondary small d-block">Membro desde {putDateOnPatternOnlyDate(perfil.usuario.created)}</span>}
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-sm-4">
                    <StatCard icon="bi-pencil-square" label="Questões respondidas" value={resolvidas} />
                </div>
                <div className="col-sm-4">
                    <StatCard icon="bi-check2-circle" label="Acertos" value={acertadas} />
                </div>
                <div className="col-sm-4">
                    <StatCard icon="bi-percent" label="Aproveitamento" value={`${resolvidas > 0 ? Math.round((acertadas / resolvidas) * 100) : 0}%`} />
                </div>
            </div>

            <div className="row g-3">
                <div className="col-lg-6">
                    <form className="card border-0 shadow-sm h-100" onSubmit={handleSave}>
                        <div className="card-body">
                            <h2 className="h5 mb-3">Dados pessoais</h2>
                            <div className="mb-3">
                                <label htmlFor="nome" className="form-label">Nome</label>
                                <input id="nome" type="text" className="form-control" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input id="email" type="email" className="form-control" value={perfil.usuario?.email || ''} disabled />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="instituicao" className="form-label">Instituição</label>
                                <input id="instituicao" type="text" className="form-control" value={form.instituicao} onChange={(event) => setForm({ ...form, instituicao: event.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
                <div className="col-lg-6">
                    <form className="card border-0 shadow-sm h-100" onSubmit={handlePasswordSubmit}>
                        <div className="card-body">
                            <h2 className="h5 mb-3">Trocar senha</h2>
                            <div className="mb-3">
                                <label htmlFor="senhaAtual" className="form-label">Senha atual</label>
                                <input id="senhaAtual" type="password" className="form-control" value={senhas.atual} onChange={(event) => setSenhas({ ...senhas, atual: event.target.value })} autoComplete="current-password" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="novaSenha" className="form-label">Nova senha</label>
                                <input id="novaSenha" type="password" className="form-control" value={senhas.nova} onChange={(event) => setSenhas({ ...senhas, nova: event.target.value })} autoComplete="new-password" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmarSenha" className="form-label">Confirmar nova senha</label>
                                <input id="confirmarSenha" type="password" className="form-control" value={senhas.confirmar} onChange={(event) => setSenhas({ ...senhas, confirmar: event.target.value })} autoComplete="new-password" required />
                            </div>
                            <button type="submit" className="btn btn-outline-primary">Atualizar senha</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PerfilPage;
