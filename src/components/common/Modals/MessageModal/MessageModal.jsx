import React from 'react';

const MessageModal = ({ isOpen, message, click, optionText = 'Fechar' }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-body">
                            <p className="mb-0">{message}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={click}>{optionText}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </>
    );
};

export default MessageModal;
