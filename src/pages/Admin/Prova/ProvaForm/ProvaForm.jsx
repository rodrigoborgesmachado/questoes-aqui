import React, { useState, useEffect } from 'react';
import provaApi from '../../../../services/apiServices/provaApi';
import tipoProvaApi from '../../../../services/apiServices/tipoProvaApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseModal from '../../../../components/common/Modals/BaseModal/BaseModal';

const createEmptyForm = () => ({
    nomeProva: '',
    local: '',
    tipoProva: '',
    dataAplicacao: '',
    banca: '',
    linkProva: '',
    linkGabarito: '',
    observacaoProva: '',
    observacaoGabarito: '',
});

const fields = [
    { name: 'nomeProva', label: 'Nome', required: true },
    { name: 'local', label: 'Local' },
    { name: 'tipoProva', label: 'Tipo da prova' },
    { name: 'dataAplicacao', label: 'Data da aplicação' },
    { name: 'banca', label: 'Banca' },
    { name: 'linkProva', label: 'Link para download da prova' },
    { name: 'linkGabarito', label: 'Link para download do gabarito' },
    { name: 'observacaoProva', label: 'Observação sobre a prova' },
    { name: 'observacaoGabarito', label: 'Observação sobre o gabarito' },
];

const ProvaForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const [formData, setFormData] = useState(createEmptyForm());
    const [tipos, setTipos] = useState([]);
    const [selectedTipos, setSelectedTipos] = useState([]);
    const [isTipoModalOpen, setIsTipoModalOpen] = useState(false);
    const [novoTipo, setNovoTipo] = useState('');
    const [refreshTipos, setRefreshTipos] = useState(0);

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const response = await tipoProvaApi.getPaginated({ page: 1, quantity: 10000 });
                setTipos(response.object || []);
            } catch {
                toast.error('Erro ao buscar tipos');
            }
        };
        fetchTipos();
    }, [refreshTipos]);

    useEffect(() => {
        if (!isEditing) {
            return;
        }

        const fetchItem = async () => {
            dispatch(setLoading(true));
            try {
                const response = await provaApi.getById(id);
                if (!response.success) {
                    toast.error('Erro ao buscar a prova.');
                    return;
                }
                const nextFormData = createEmptyForm();
                Object.keys(nextFormData).forEach((field) => {
                    nextFormData[field] = response.object[field] ?? '';
                });
                setFormData(nextFormData);
                setSelectedTipos((response.object.tipoProvaAssociado || []).map((item) => item.codigoTipo));
            } catch {
                toast.error('Erro ao buscar a prova.');
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

    const toggleTipo = (codigo) => {
        setSelectedTipos((previous) => previous.includes(codigo) ? previous.filter((item) => item !== codigo) : [...previous, codigo]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(setLoading(true));

        try {
            const payload = {
                ...formData,
                TipoProvaAssociado: selectedTipos.map((codigoTipo) => ({ codigoTipo, codigoProva: isEditing ? Number(id) : 0 })),
            };
            const response = isEditing ? await provaApi.update({ id: Number(id), ...payload }) : await provaApi.create(payload);
            if (response.success) {
                toast.success(isEditing ? 'Prova atualizada com sucesso!' : 'Prova cadastrada com sucesso!');
                navigate('/provas');
            } else {
                toast.warn(response.message || 'Erro ao salvar a prova!');
            }
        } catch {
            toast.error('Erro ao salvar a prova!');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const addTipo = async (event) => {
        event.preventDefault();
        dispatch(setLoading(true));
        try {
            const response = await tipoProvaApi.create({ descricao: novoTipo });
            if (response.success) {
                toast.success('Tipo cadastrado!');
                setNovoTipo('');
                setIsTipoModalOpen(false);
                setRefreshTipos((previous) => previous + 1);
            } else {
                toast.warn(response.message || 'Erro ao cadastrar tipo!');
            }
        } catch {
            toast.error('Erro ao cadastrar tipo!');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-fluid py-4">
            <BaseModal isOpen={isTipoModalOpen} title="Cadastro de tipo" onClose={() => setIsTipoModalOpen(false)}>
                <form onSubmit={addTipo}>
                    <label htmlFor="novoTipo" className="form-label">Novo tipo</label>
                    <input id="novoTipo" type="text" className="form-control mb-3" value={novoTipo} onChange={(event) => setNovoTipo(event.target.value)} required />
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">Adicionar</button>
                    </div>
                </form>
            </BaseModal>
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-body">
                    <h1 className="h4 mb-0">{isEditing ? 'Editar Prova' : 'Nova Prova'}</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {fields.map((field) => (
                                <div key={field.name} className="col-md-6">
                                    <label htmlFor={field.name} className="form-label">{field.label}</label>
                                    <input id={field.name} name={field.name} type="text" className="form-control" value={formData[field.name] ?? ''} onChange={handleChange} required={field.required} />
                                </div>
                            ))}
                            <div className="col-12">
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    <span className="form-label mb-0">Tipos</span>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsTipoModalOpen(true)}>
                                        <i className="bi bi-plus-lg me-1" aria-hidden="true"></i>
                                        Adicionar tipo
                                    </button>
                                </div>
                                <div className="d-flex flex-wrap gap-3">
                                    {tipos.map((tipo) => (
                                        <div key={tipo.codigo} className="form-check">
                                            <input id={`tipo-${tipo.codigo}`} type="checkbox" className="form-check-input" checked={selectedTipos.includes(tipo.codigo)} onChange={() => toggleTipo(tipo.codigo)} />
                                            <label htmlFor={`tipo-${tipo.codigo}`} className="form-check-label">{tipo.descricao}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
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

export default ProvaForm;
