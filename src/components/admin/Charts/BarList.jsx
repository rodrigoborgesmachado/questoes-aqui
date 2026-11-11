import React, { useState } from 'react';
import './BarList.css';

const VISIBLE_ITEMS = 8;
const numberFormatter = new Intl.NumberFormat('pt-BR');

const useVisibleItems = (items) => {
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? items : items.slice(0, VISIBLE_ITEMS);
    const toggle = items.length > VISIBLE_ITEMS && (
        <button type="button" className="btn btn-link btn-sm px-0" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Mostrar menos' : `Mostrar todos (${items.length})`}
        </button>
    );

    return [visible, toggle];
};

export const BarList = ({ items = [] }) => {
    const max = Math.max(...items.map((item) => Number(item.value || 0)), 1);
    const [visible, toggle] = useVisibleItems(items);

    return (
        <div className="bar-list">
            {visible.map((item, index) => (
                <div key={`${item.label}-${index}`} className="bar-list-row">
                    <span className="bar-list-label" title={item.label}>{item.label}</span>
                    <div className="progress bar-list-track" role="img" aria-label={`${item.label}: ${item.value}`}>
                        <div className="progress-bar bar-list-primary" style={{ width: `${(Number(item.value || 0) / max) * 100}%` }}></div>
                    </div>
                    <span className="bar-list-value">{numberFormatter.format(item.value || 0)}</span>
                </div>
            ))}
            {toggle}
        </div>
    );
};

export const StackedBarList = ({ items = [], primaryLabel = 'Corretas', secondaryLabel = 'Erradas' }) => {
    const sorted = [...items].sort((a, b) => (b.primary + b.secondary) - (a.primary + a.secondary));
    const max = Math.max(...sorted.map((item) => item.primary + item.secondary), 1);
    const [visible, toggle] = useVisibleItems(sorted);

    return (
        <div className="bar-list">
            <div className="d-flex gap-3 small text-body-secondary mb-1">
                <span><span className="bar-list-dot bar-list-primary"></span>{primaryLabel}</span>
                <span><span className="bar-list-dot bar-list-secondary"></span>{secondaryLabel}</span>
            </div>
            {visible.map((item, index) => (
                <div key={`${item.label}-${index}`} className="bar-list-row">
                    <span className="bar-list-label" title={item.label}>{item.label}</span>
                    <div className="progress-stacked bar-list-track" role="img" aria-label={`${item.label}: ${item.primary} ${primaryLabel}, ${item.secondary} ${secondaryLabel}`}>
                        <div className="progress" style={{ width: `${(item.primary / max) * 100}%` }}>
                            <div className="progress-bar bar-list-primary"></div>
                        </div>
                        <div className="progress" style={{ width: `${(item.secondary / max) * 100}%` }}>
                            <div className="progress-bar bar-list-secondary"></div>
                        </div>
                    </div>
                    <span className="bar-list-value">{numberFormatter.format(item.primary)} / {numberFormatter.format(item.secondary)}</span>
                </div>
            ))}
            {toggle}
        </div>
    );
};
