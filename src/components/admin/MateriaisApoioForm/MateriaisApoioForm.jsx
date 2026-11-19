import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import materialApoioProvaApi from '../../../services/apiServices/materialApoioProvaApi';
import ConfirmModal from '../../common/Modals/ConfirmModal/ConfirmModal';
import { MAX_MATERIAL_TITLE, validateMaterial } from '../../client/MateriaisApoio/materialApoioUtils';

const emptyForm = { codigo: 0, title: '', url: '' };

const MateriaisApoioForm = ({ codigoProva }) => {
    const [materiais, setMateriais] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [isSaving, setIsSaving] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const isEditing = formData.codigo > 0;

    useEffect(() => {
        const fetchMateriais = async () => {
            try {
                const response = await materialApoioProvaApi.getByProva(codigoProva);
                setMateriais(response.object || []);
            } catch {
                toast.error('Erro ao buscar os materiais de apoio.');
            }
        };
        fetchMateriais();
    }, [codigoProva, refresh]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const save = async () => {
        const error = validateMaterial(formData);
        if (error) {
            toast.warning(error);
            return;
        }
        setIsSaving(true);
        try {
            const payload = { ...formData, codigoProva, title: formData.title.trim(), url: formData.url.trim() };
            const response = isEditing ? await materialApoioProvaApi.update(payload) : await materialApoioProvaApi.create(payload);
            if (!response.success) {
                toast.warn(response.message || 'Erro ao salvar o material de apoio!');
                return;
            }
            toast.success(isEditing ? 'Material de apoio atualizado!' : 'Material de apoio adicionado!');
            setFormData(emptyForm);
            setRefresh((previous) => previous + 1);
        } catch {
            toast.error('Erro ao salvar o material de apoio!');
        } finally {
            setIsSaving(false);
        }
    };

    const remove = async (material) => {
        setItemToDelete(null);
        try {
            const response = await materialApoioProvaApi.delete(material.codigo);
            if (!response.success) {
                toast.warn(response.message || 'Erro ao remover o material de apoio!');
                return;
            }
            toast.success('Material de apoio removido!');
            if (formData.codigo === material.codigo) {
                setFormData(emptyForm);
            }
            setRefresh((previous) => previous + 1);
        } catch {
            toast.error('Erro ao remover o material de apoio!');
        }
    };

    return (
        <div className="card border-0 shadow-sm mt-4">
            <ConfirmModal isOpen={Boolean(itemToDelete)} title="Remover material de apoio" message={`Deseja remover o material "${itemToDelete?.title}"?`} confirmData={itemToDelete} onYes={remove} onNo={() => setItemToDelete(null)} />
            <div className="card-header bg-body">
                <h2 className="h5 mb-0">Materiais de apoio</h2>
            </div>
            <div className="card-body">
                <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <label htmlFor="materialTitle" className="form-label">Título</label>
                        <input id="materialTitle" name="title" type="text" className="form-control" value={formData.title} onChange={handleChange} maxLength={MAX_MATERIAL_TITLE} />
                    </div>
                    <div className="col-md-5">
                        <label htmlFor="materialUrl" className="form-label">URL</label>
                        <input id="materialUrl" name="url" type="url" className="form-control" value={formData.url} onChange={handleChange} placeholder="https://" />
                    </div>
                    <div className="col-md-3 d-flex gap-2">
                        <button type="button" className="btn btn-primary" onClick={save} disabled={isSaving}>
                            <i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-plus-lg'} me-1`} aria-hidden="true"></i>
                            {isEditing ? 'Salvar' : 'Adicionar'}
                        </button>
                        {isEditing && (
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setFormData(emptyForm)}>Cancelar</button>
                        )}
                    </div>
                </div>

                {materiais.length === 0 && <p className="text-body-secondary mt-3 mb-0">Nenhum material de apoio cadastrado.</p>}
                {materiais.length > 0 && (
                    <ul className="list-group mt-3">
                        {materiais.map((material) => (
                            <li key={material.codigo} className="list-group-item d-flex justify-content-between align-items-center gap-2">
                                <div className="text-break">
                                    <div>{material.title}</div>
                                    <a href={material.url} target="_blank" rel="noopener noreferrer" className="small">{material.url}</a>
                                </div>
                                <div className="d-flex gap-2 flex-shrink-0">
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setFormData({ codigo: material.codigo, title: material.title, url: material.url })} aria-label={`Editar ${material.title}`}>
                                        <i className="bi bi-pencil" aria-hidden="true"></i>
                                    </button>
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setItemToDelete(material)} aria-label={`Remover ${material.title}`}>
                                        <i className="bi bi-trash" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MateriaisApoioForm;
