import React from 'react';

const BaseModal = ({ isOpen, title, onClose, size = '', children, footer }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="base-modal-title">
                <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${size}`}>
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header">
                            <h2 id="base-modal-title" className="modal-title h5">{title}</h2>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar"></button>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                        {footer && <div className="modal-footer">{footer}</div>}
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </>
    );
};

export default BaseModal;
