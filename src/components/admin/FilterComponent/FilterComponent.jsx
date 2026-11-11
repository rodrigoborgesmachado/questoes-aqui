import React, { useState } from 'react';

const FilterComponent = ({ placeHolder, showTermFilter, showStartDate = false, showEndDate = false, showIsActiveFilter = false, submitFilter, exportFunction }) => {
    const [term, setTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isActive, setIsActive] = useState('');

    const handleSubmit = () => {
        submitFilter({
            term: term || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            isActive: isActive || undefined,
        });
    };

    const exportReport = () => {
        exportFunction({
            term: term || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            isActive: isActive || undefined,
        });
    };

    return (
        <div className="row g-3 align-items-end mb-4">
            {showTermFilter && (
                <div className="col-lg-4 col-md-6">
                    <label htmlFor="search" className="form-label">Filtro</label>
                    <input id="search" type="text" placeholder={placeHolder} className="form-control" value={term} onChange={(event) => setTerm(event.target.value)} />
                </div>
            )}
            {showStartDate && (
                <div className="col-lg-2 col-md-3">
                    <label htmlFor="startDate" className="form-label">Data inicial</label>
                    <input id="startDate" type="date" className="form-control" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                </div>
            )}
            {showEndDate && (
                <div className="col-lg-2 col-md-3">
                    <label htmlFor="endDate" className="form-label">Data final</label>
                    <input id="endDate" type="date" className="form-control" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                </div>
            )}
            {showIsActiveFilter && (
                <div className="col-lg-2 col-md-6">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select id="status" className="form-select" value={isActive} onChange={(event) => setIsActive(event.target.value)}>
                        <option value="">Todos</option>
                        <option value="true">Ativos</option>
                        <option value="false">Inativos</option>
                    </select>
                </div>
            )}
            <div className="col-lg-2 col-md-6 d-grid">
                <button type="button" onClick={handleSubmit} className="btn btn-outline-primary">
                    <i className="bi bi-search me-2" aria-hidden="true"></i>
                    Filtrar
                </button>
            </div>
            {exportFunction && (
                <div className="col-lg-2 col-md-6 d-grid">
                    <button type="button" onClick={exportReport} className="btn btn-outline-secondary">
                        <i className="bi bi-download me-2" aria-hidden="true"></i>
                        Exportar
                    </button>
                </div>
            )}
        </div>
    );
};

export default FilterComponent;
