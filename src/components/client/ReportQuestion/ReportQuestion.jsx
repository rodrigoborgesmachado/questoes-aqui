import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import reportesQuestoesApi from '../../../services/apiServices/reportesQuestoesApi';
import BaseModal from '../../common/Modals/BaseModal/BaseModal';
import { MAX_REPORT_DESCRIPTION, REPORT_MOTIVOS, validateReport } from './reportUtils';

const ReportQuestion = ({ questaoId }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [isOpen, setIsOpen] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isReported, setIsReported] = useState(false);

    if (!isAuthenticated || !questaoId) return null;

    const close = () => {
        setIsOpen(false);
        setMotivo('');
        setDescricao('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const error = validateReport({ motivo, descricao });
        if (error) {
            toast.warning(error);
            return;
        }
        setIsSending(true);
        try {
            const response = await reportesQuestoesApi.add({ codigoQuestao: questaoId, motivo, descricao: descricao.trim() });
            if (!response.success) {
                toast.error(response.message || 'Não foi possível reportar o problema.');
                return;
            }
            toast.success('Problema reportado. Obrigado por ajudar a melhorar a questão!');
            setIsReported(true);
            close();
        } catch {
            toast.error('Não foi possível reportar o problema.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <div className="text-end mt-3">
                <button type="button" className="btn btn-link link-secondary btn-sm p-0" onClick={() => setIsOpen(true)} disabled={isReported}>
                    <i className={`bi ${isReported ? 'bi-flag-fill' : 'bi-flag'} me-1`} aria-hidden="true"></i>{isReported ? 'Problema reportado' : 'Reportar problema'}
                </button>
            </div>

            <BaseModal
                isOpen={isOpen}
                title="Reportar problema"
                onClose={close}
                footer={(
                    <>
                        <button type="button" className="btn btn-outline-secondary" onClick={close}>Cancelar</button>
                        <button type="submit" form="report-question-form" className="btn btn-primary" disabled={isSending || !motivo}>
                            {isSending ? 'Enviando...' : 'Enviar'}
                        </button>
                    </>
                )}
            >
                <form id="report-question-form" onSubmit={handleSubmit}>
                    <fieldset className="mb-3">
                        <legend className="form-label fs-6">Qual o problema?</legend>
                        {REPORT_MOTIVOS.map((item) => (
                            <div key={item.value} className="form-check">
                                <input
                                    id={`report-motivo-${item.value}`}
                                    type="radio"
                                    name="report-motivo"
                                    className="form-check-input"
                                    value={item.value}
                                    checked={motivo === item.value}
                                    onChange={(event) => setMotivo(event.target.value)}
                                />
                                <label htmlFor={`report-motivo-${item.value}`} className="form-check-label">{item.label}</label>
                            </div>
                        ))}
                    </fieldset>
                    <label htmlFor="report-descricao" className="form-label">
                        Descrição{motivo === 'outro' ? '' : ' (opcional)'}
                    </label>
                    <textarea
                        id="report-descricao"
                        className="form-control"
                        rows="3"
                        maxLength={MAX_REPORT_DESCRIPTION}
                        placeholder="Conte o que encontrou de errado"
                        value={descricao}
                        onChange={(event) => setDescricao(event.target.value)}
                    ></textarea>
                    <div className="small text-body-secondary text-end mt-1">{descricao.length}/{MAX_REPORT_DESCRIPTION}</div>
                </form>
            </BaseModal>
        </>
    );
};

export default ReportQuestion;
