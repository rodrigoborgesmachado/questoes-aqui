import React from 'react';
import './BarList.css';
import './ColumnChart.css';

const numberFormatter = new Intl.NumberFormat('pt-BR');

const ColumnChart = ({ items = [], primaryLabel, secondaryLabel }) => {
    const max = Math.max(...items.map((item) => item.primary + (item.secondary || 0)), 1);

    return (
        <div>
            {secondaryLabel && (
                <div className="d-flex gap-3 small text-body-secondary mb-2">
                    <span><span className="bar-list-dot bar-list-primary"></span>{primaryLabel}</span>
                    <span><span className="bar-list-dot bar-list-secondary"></span>{secondaryLabel}</span>
                </div>
            )}
            <div className="column-chart">
                {items.map((item) => {
                    const total = item.primary + (item.secondary || 0);
                    const description = secondaryLabel
                        ? `${item.label}: ${numberFormatter.format(item.primary)} ${primaryLabel}, ${numberFormatter.format(item.secondary || 0)} ${secondaryLabel}`
                        : `${item.label}: ${numberFormatter.format(item.primary)} ${primaryLabel}`;

                    return (
                        <div key={item.label} className="column-chart-item" title={description}>
                            <span className="column-chart-value">{total > 0 ? numberFormatter.format(total) : ''}</span>
                            <div className="column-chart-track" role="img" aria-label={description}>
                                {secondaryLabel && <div className="column-chart-bar bar-list-secondary" style={{ height: `${((item.secondary || 0) / max) * 100}%` }}></div>}
                                <div className="column-chart-bar bar-list-primary" style={{ height: `${(item.primary / max) * 100}%` }}></div>
                            </div>
                            <span className="column-chart-label">{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ColumnChart;
