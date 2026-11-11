import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onYes, onNo, confirmData, yesLabel = 'Sim', noLabel = 'Não' }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header">
                            <h2 id="confirm-modal-title" className="modal-title h5">{title}</h2>
                        </div>
                        <div className="modal-body">
                            <p className="mb-0">{message}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onNo}>{noLabel}</button>
                            <button type="button" className="btn btn-primary" onClick={() => onYes(confirmData)}>{yesLabel}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </>
    );
};

export default ConfirmModal;
