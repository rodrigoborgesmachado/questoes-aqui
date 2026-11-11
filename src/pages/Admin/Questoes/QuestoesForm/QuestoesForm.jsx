import React, { useState, useEffect } from 'react';
import questoesApi from '../../../../services/apiServices/questoesApi';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseModal from '../../../../components/common/Modals/BaseModal/BaseModal';
import './QuestoesForm.css';

const createEmptyResposta = () => ({ textoResposta: '', certa: false, anexoResposta: [] });

const createEmptyForm = (codigoProva, numero) => ({
    campoQuestao: `<b>Questão ${String(numero).padStart(2, '0')}</b><br><br>`,
    observacaoQuestao: '',
    materia: '',
    assunto: '',
    codigoProva,
    numeroQuestao: numero,
    ativo: '1',
    respostasUsuarios: [],
    respostasQuestoes: Array.from({ length: 5 }, createEmptyResposta),
    anexosQuestoes: [],
});

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const buildQuestaoHtml = (text, anexos) => {
    return (anexos || []).reduce((html, anexo, index) => (
        html.replace(`<img src="#" alt="Anexo" id="divAnexo${index}"/>`, `<img src="${anexo.anexo}" alt="Anexo" id="divAnexo${index}"/>`)
    ), text || '');
};

const QuestoesForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id, provaId } = useParams();
    const [searchParams] = useSearchParams();
    const isEditing = Boolean(id);
    const [questao, setQuestao] = useState(() => createEmptyForm(provaId, searchParams.get('numero') || 1));
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        if (!isEditing) {
            return;
        }

        const fetchItem = async () => {
            dispatch(setLoading(true));
            try {
                const response = await questoesApi.getById(id);
                if (!response.success) {
                    toast.error('Erro ao buscar questão');
                    return;
                }
                setQuestao({
                    ...response.object,
                    respostasQuestoes: (response.object.respostasQuestoes || []).map((resposta) => ({
                        ...resposta,
                        certa: resposta.certa === '1',
                        anexoResposta: resposta.anexoResposta || [],
                    })),
                });
            } catch {
                toast.error('Erro ao buscar questão');
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchItem();
    }, [id, dispatch, isEditing]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setQuestao((previous) => ({ ...previous, [name]: value }));
    };

    const appendToCampoQuestao = (text) => {
        setQuestao((previous) => ({ ...previous, campoQuestao: `${previous.campoQuestao}${text}` }));
    };

    const addImagePlaceholder = () => {
        const nextIndex = (questao.campoQuestao.match(/id="divAnexo\d+"/g) || []).length;
        appendToCampoQuestao(`<img src="#" alt="Anexo" id="divAnexo${nextIndex}"/>`);
    };

    const updateResposta = (index, changes) => {
        setQuestao((previous) => ({
            ...previous,
            respostasQuestoes: previous.respostasQuestoes.map((resposta, position) => position === index ? { ...resposta, ...changes } : resposta),
        }));
    };

    const removeResposta = (index) => {
        setQuestao((previous) => ({
            ...previous,
            respostasQuestoes: previous.respostasQuestoes.filter((resposta, position) => position !== index),
        }));
    };

    const handleAnexosQuestao = async (event) => {
        try {
            const anexos = await Promise.all(Array.from(event.target.files).map(readFileAsDataUrl));
            setQuestao((previous) => ({ ...previous, anexosQuestoes: anexos.map((anexo) => ({ anexo })) }));
        } catch {
            toast.error('Erro ao ler o arquivo.');
        }
    };

    const handleAnexoResposta = async (index, event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        try {
            const anexo = await readFileAsDataUrl(file);
            updateResposta(index, { anexoResposta: [{ anexo }] });
        } catch {
            toast.error('Erro ao ler o arquivo.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!questao.respostasQuestoes.some((resposta) => resposta.certa)) {
            toast.warn('Nenhuma resposta foi marcada como certa!');
            return;
        }

        const payload = {
            ...questao,
            respostasQuestoes: questao.respostasQuestoes.map((resposta) => ({ ...resposta, certa: resposta.certa ? '1' : '2' })),
        };

        dispatch(setLoading(true));
        try {
            const response = isEditing ? await questoesApi.update(payload) : await questoesApi.create(payload);
            if (response.success) {
                toast.success(isEditing ? 'Questão editada com sucesso!' : 'Questão cadastrada com sucesso!');
                navigate(`/provas/${questao.codigoProva}/questoes`);
            } else {
                toast.warn(response.message || 'Erro ao salvar a questão!');
            }
        } catch {
            toast.error('Erro ao salvar a questão!');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-fluid py-4">
            <BaseModal isOpen={isPreviewOpen} title="Pré-visualização" size="modal-lg" onClose={() => setIsPreviewOpen(false)}>
                <h3 className="h5">Matéria: {questao.materia}</h3>
                <p className="text-body-secondary">Assunto: {questao.assunto}</p>
                <div className="questao-preview mb-3" dangerouslySetInnerHTML={{ __html: buildQuestaoHtml(questao.campoQuestao, questao.anexosQuestoes) }}></div>
                {questao.respostasQuestoes.map((resposta, index) => (
                    <div key={index} className="form-check questao-preview mb-2">
                        <input type="radio" className="form-check-input" checked={Boolean(resposta.certa)} readOnly />
                        {resposta.anexoResposta?.[0]?.anexo
                            ? <img src={resposta.anexoResposta[0].anexo} alt={`Resposta ${index + 1}`} />
                            : <span dangerouslySetInnerHTML={{ __html: resposta.textoResposta }}></span>}
                    </div>
                ))}
            </BaseModal>
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-body">
                    <h1 className="h4 mb-0">{isEditing ? `Editar Questão #${id}` : 'Nova Questão'}</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-12">
                                <label htmlFor="campoQuestao" className="form-label">Descrição</label>
                                <div className="d-flex flex-wrap gap-2 mb-2">
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => appendToCampoQuestao('<b></b>')}>Negrito</button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => appendToCampoQuestao('<i></i>')}>Itálico</button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => appendToCampoQuestao('<br>')}>Saltar linha</button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addImagePlaceholder}>Add imagem</button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => appendToCampoQuestao('<span>&#8730;</span>')}>Add raiz quadrada</button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => appendToCampoQuestao('<span>&#960;</span>')}>Add Pi</button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => appendToCampoQuestao('<sup></sup>')}>Add elevação (sup)</button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => appendToCampoQuestao('<sub></sub>')}>Add citação (sub)</button>
                                </div>
                                <textarea id="campoQuestao" name="campoQuestao" className="form-control font-monospace" rows="16" placeholder="Descrição da questão" value={questao.campoQuestao ?? ''} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="materia" className="form-label">Matéria</label>
                                <input id="materia" name="materia" type="text" className="form-control" value={questao.materia ?? ''} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="assunto" className="form-label">Assunto</label>
                                <input id="assunto" name="assunto" type="text" className="form-control" value={questao.assunto ?? ''} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="numeroQuestao" className="form-label">Número da questão</label>
                                <input id="numeroQuestao" name="numeroQuestao" type="text" className="form-control" value={questao.numeroQuestao ?? ''} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="observacaoQuestao" className="form-label">Observação</label>
                                <input id="observacaoQuestao" name="observacaoQuestao" type="text" className="form-control" value={questao.observacaoQuestao ?? ''} onChange={handleChange} />
                            </div>
                            <div className="col-12">
                                <label htmlFor="anexosQuestoes" className="form-label">Anexos da questão ({questao.anexosQuestoes?.length ?? 0})</label>
                                <input id="anexosQuestoes" type="file" className="form-control" accept="image/*" multiple onChange={handleAnexosQuestao} />
                            </div>
                        </div>

                        <h2 className="h5 mt-4 mb-3">Respostas</h2>
                        {questao.respostasQuestoes.map((resposta, index) => (
                            <div key={index} className="border rounded p-3 mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label htmlFor={`resposta-${index}`} className="form-label mb-0">Resposta {index + 1}</label>
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeResposta(index)}>
                                        <i className="bi bi-trash me-1" aria-hidden="true"></i>
                                        Remover
                                    </button>
                                </div>
                                <input id={`resposta-${index}`} type="text" className="form-control mb-2" value={resposta.textoResposta ?? ''} onChange={(event) => updateResposta(index, { textoResposta: event.target.value })} />
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-4">
                                        <div className="form-check">
                                            <input id={`certa-${index}`} type="checkbox" className="form-check-input" checked={Boolean(resposta.certa)} onChange={(event) => updateResposta(index, { certa: event.target.checked })} />
                                            <label htmlFor={`certa-${index}`} className="form-check-label">Resposta correta</label>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <input type="file" className="form-control form-control-sm" accept="image/*" aria-label={`Anexo da resposta ${index + 1}`} onChange={(event) => handleAnexoResposta(index, event)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setQuestao((previous) => ({ ...previous, respostasQuestoes: [...previous.respostasQuestoes, createEmptyResposta()] }))}>
                            <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
                            Adicionar resposta
                        </button>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-outline-primary" onClick={() => setIsPreviewOpen(true)}>
                                <i className="bi bi-eye me-2" aria-hidden="true"></i>
                                Testar layout
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

export default QuestoesForm;
