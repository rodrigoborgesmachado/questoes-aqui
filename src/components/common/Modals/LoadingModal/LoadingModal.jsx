import React from 'react';

const LoadingModal = () => {
    return (
        <>
            <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-label="Carregando">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-body d-flex align-items-center justify-content-center gap-3 p-4">
                            <div className="spinner-border text-app-primary" role="status" aria-hidden="true"></div>
                            <span>Carregando...</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </>
    );
};

export default LoadingModal;
