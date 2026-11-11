import React, { useState, useEffect } from 'react';
import notascortesisuApi from '../../../../services/apiServices/notascortesisuApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { normalizeNotaCorteSisu, notasCorteSisuFields } from '../notasCorteSisuFields';

const createEmptyForm = () => notasCorteSisuFields.reduce((form, field) => ({ ...form, [field.name]: '' }), {});

const NotascortesisuForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const [formData, setFormData] = useState(createEmptyForm());

    useEffect(() => {
        if (!isEditing) {
            return;
        }

        const fetchItem = async () => {
            dispatch(setLoading(true));
            try {
                const response = await notascortesisuApi.getById(id);
                if (!response.success || !response.object) {
                    toast.error('Erro ao buscar o item.');
                    return;
                }
                const item = normalizeNotaCorteSisu(response.object);
                const nextFormData = createEmptyForm();
                Object.keys(nextFormData).forEach((field) => {
                    nextFormData[field] = item[field] ?? '';
                });
                setFormData(nextFormData);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(setLoading(true));

        try {
            const payload = notasCorteSisuFields.reduce((data, field) => ({
                ...data,
                [field.name]: field.type === 'number' ? Number(formData[field.name]) : formData[field.name],
            }), {});
            const response = isEditing ? await notascortesisuApi.update({ id: Number(id), ...payload }) : await notascortesisuApi.create(payload);
            if (response.success) {
                toast.success(isEditing ? 'Atualizado com sucesso!' : 'Criado com sucesso!');
                navigate('/notas-de-corte');
            } else {
                toast.warn(response.message || 'Erro ao salvar o item.');
            }
        } catch {
            toast.error('Erro ao salvar o item.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-body">
                    <h1 className="h4 mb-0">{isEditing ? 'Editar Nota de corte' : 'Nova Nota de corte'}</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {notasCorteSisuFields.map((field) => (
                                <div key={field.name} className="col-md-6">
                                    <label htmlFor={field.name} className="form-label">{field.label}</label>
                                    <input id={field.name} name={field.name} type={field.type ?? 'text'} step={field.step} className="form-control" value={formData[field.name] ?? ''} onChange={handleChange} required />
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                                Cancelar
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

export default NotascortesisuForm;
