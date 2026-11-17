import React, { useState, useEffect } from 'react';
import postagemApi from '../../../../services/apiServices/postagemApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseModal from '../../../../components/common/Modals/BaseModal/BaseModal';
import { buildPostagemPayload, createEmptyPostagem, tiposPostagem, toPostagemForm } from '../postagemFields';
import './PostagemForm.css';

const htmlButtons = [
    { label: 'Negrito', html: '<b></b>' },
    { label: 'Itálico', html: '<i></i>' },
    { label: 'Parágrafo', html: '<p></p>' },
    { label: 'Saltar linha', html: '<br>' },
    { label: 'Título', html: '<h3></h3>' },
    { label: 'Link', html: '<a href="" target="_blank" rel="noreferrer"></a>' },
    { label: 'Imagem', html: '<img src="" alt="">' },
    { label: 'Lista', html: '<ul>\n    <li></li>\n</ul>' },
];

const PostagemForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const [original, setOriginal] = useState({});
    const [formData, setFormData] = useState(createEmptyPostagem());
    const [previewIdioma, setPreviewIdioma] = useState(null);

    useEffect(() => {
        if (!isEditing) {
            return;
        }

        const fetchItem = async () => {
            dispatch(setLoading(true));
            try {
                const response = await postagemApi.getById(id);
                if (!response.success || !response.object) {
                    toast.error('Erro ao buscar o item.');
                    return;
                }
                setOriginal(response.object);
                setFormData(toPostagemForm(response.object));
            } catch {
                toast.error('Erro ao buscar o item.');
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchItem();
    }, [id, dispatch, isEditing]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const appendHtml = (field, html) => {
        setFormData((previous) => ({ ...previous, [field]: `${previous[field] ?? ''}${html}` }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(setLoading(true));

        try {
            const payload = buildPostagemPayload(formData, original);
            const response = isEditing ? await postagemApi.update(payload) : await postagemApi.create(payload);
            if (response.success) {
                toast.success(isEditing ? 'Atualizado com sucesso!' : 'Criado com sucesso!');
                navigate('/portfolio/postagens');
            } else {
                toast.warn(response.message || 'Erro ao salvar o item.');
            }
        } catch {
            toast.error('Erro ao salvar o item.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const renderHtmlField = (name, label, rows) => (
        <div className="col-12">
            <label htmlFor={name} className="form-label">{label}</label>
            <div className="d-flex flex-wrap gap-2 mb-2">
                {htmlButtons.map((button) => (
                    <button key={button.label} type="button" className="btn btn-outline-secondary btn-sm" onClick={() => appendHtml(name, button.html)}>{button.label}</button>
                ))}
            </div>
            <textarea id={name} name={name} className="form-control font-monospace" rows={rows} value={formData[name] ?? ''} onChange={handleChange} required />
        </div>
    );

    const sufixo = previewIdioma === 'en' ? 'En' : '';

    return (
        <div className="container-fluid py-4">
            <BaseModal isOpen={Boolean(previewIdioma)} title={`Pré-visualização (${previewIdioma === 'en' ? 'Inglês' : 'Português'})`} size="modal-lg" onClose={() => setPreviewIdioma(null)}>
                <div className="postagem-preview">
                    {formData.capa && <img src={formData.capa} alt="" className="rounded mb-3" />}
                    <h3 className="h4">{formData[`titulo${sufixo}`]}</h3>
                    <div className="text-body-secondary mb-3" dangerouslySetInnerHTML={{ __html: formData[`intro${sufixo}`] }}></div>
                    <div dangerouslySetInnerHTML={{ __html: formData[`descricao${sufixo}`] }}></div>
                </div>
            </BaseModal>
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-body">
                    <h1 className="h4 mb-0">{isEditing ? `Editar Postagem #${id}` : 'Nova Postagem'}</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="titulo" className="form-label">Título</label>
                                <input id="titulo" name="titulo" type="text" className="form-control" value={formData.titulo} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="tituloEn" className="form-label">Título (inglês)</label>
                                <input id="tituloEn" name="tituloEn" type="text" className="form-control" value={formData.tituloEn} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="tipoPostagem" className="form-label">Tipo</label>
                                <select id="tipoPostagem" name="tipoPostagem" className="form-select" value={formData.tipoPostagem} onChange={handleChange} required>
                                    {tiposPostagem.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="capa" className="form-label">Capa (URL)</label>
                                <input id="capa" name="capa" type="text" className="form-control" value={formData.capa} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="link" className="form-label">Link</label>
                                <input id="link" name="link" type="text" className="form-control" value={formData.link} onChange={handleChange} />
                            </div>
                            {renderHtmlField('intro', 'Introdução', 4)}
                            {renderHtmlField('introEn', 'Introdução (inglês)', 4)}
                            {renderHtmlField('descricao', 'Descrição', 14)}
                            {renderHtmlField('descricaoEn', 'Descrição (inglês)', 14)}
                        </div>
                        <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-outline-primary" onClick={() => setPreviewIdioma('pt')}>
                                <i className="bi bi-eye me-2" aria-hidden="true"></i>
                                Testar layout
                            </button>
                            <button type="button" className="btn btn-outline-primary" onClick={() => setPreviewIdioma('en')}>
                                <i className="bi bi-eye me-2" aria-hidden="true"></i>
                                Testar layout (inglês)
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <i className="bi bi-check-lg me-2" aria-hidden="true"></i>
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostagemForm;
