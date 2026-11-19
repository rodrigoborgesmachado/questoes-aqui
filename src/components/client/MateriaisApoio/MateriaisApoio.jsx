import React, { useState } from 'react';
import { toast } from 'react-toastify';
import materialApoioProvaApi from '../../../services/apiServices/materialApoioProvaApi';
import BaseModal from '../../common/Modals/BaseModal/BaseModal';
import { hasMateriaisApoio } from './materialApoioUtils';

const MateriaisApoio = ({ prova }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [materiais, setMateriais] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    if (!hasMateriaisApoio(prova)) return null;

    const open = async () => {
        setIsOpen(true);
        setIsLoading(true);
        try {
            const response = await materialApoioProvaApi.getByProva(prova.Id);
            if (!response.success) {
                toast.error(response.message || 'Erro ao buscar os materiais de apoio.');
                return;
            }
            setMateriais(response.object || []);
        } catch {
            toast.error('Erro ao buscar os materiais de apoio.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={open}>
                <i className="bi bi-journal-bookmark me-1" aria-hidden="true"></i>Material de apoio
            </button>

            <BaseModal isOpen={isOpen} title="Material de apoio" onClose={() => setIsOpen(false)}>
                <p className="small text-body-secondary">{prova.nomeProva}</p>
                {isLoading && <p className="text-body-secondary mb-0">Carregando...</p>}
                {!isLoading && materiais.length === 0 && <p className="text-body-secondary mb-0">Nenhum material de apoio disponível.</p>}
                {!isLoading && materiais.length > 0 && (
                    <div className="list-group">
                        {materiais.map((material) => (
                            <a key={material.codigo} href={material.url} target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center gap-2">
                                <span>{material.title}</span>
                                <i className="bi bi-box-arrow-up-right" aria-hidden="true"></i>
                            </a>
                        ))}
                    </div>
                )}
            </BaseModal>
        </>
    );
};

export default MateriaisApoio;
