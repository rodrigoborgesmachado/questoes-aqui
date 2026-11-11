import React from 'react';

const StatCard = ({ icon, label, value, note }) => (
    <div className="card border-0 shadow-sm h-100">
        <div className="card-body d-flex align-items-center gap-3">
            <span className="client-icon-circle">
                <i className={`bi ${icon} fs-5`} aria-hidden="true"></i>
            </span>
            <div>
                <span className="text-body-secondary small d-block">{label}</span>
                <strong className="d-block fs-4 lh-sm">{value}</strong>
                {note && <span className="text-body-secondary small">{note}</span>}
            </div>
        </div>
    </div>
);

export default StatCard;
