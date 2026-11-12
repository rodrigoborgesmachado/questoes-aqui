import React from 'react';
import { Link } from 'react-router-dom';
import './BrandLogo.css';

const sizes = {
    sm: { icon: 'fs-4', text: '' },
    lg: { icon: 'fs-1', text: 'fs-3' },
};

const BrandLogo = ({ size = 'sm', to, className = '', onClick }) => {
    const { icon, text } = sizes[size] ?? sizes.sm;
    const classes = `brand-logo d-inline-flex align-items-center gap-2 fw-semibold text-decoration-none ${className}`.trim();
    const content = (
        <>
            <i className={`bi bi-mortarboard-fill ${icon}`} aria-hidden="true"></i>
            <span className={text || undefined}>Questões Aqui</span>
        </>
    );

    return to ? (
        <Link to={to} className={classes} onClick={onClick}>{content}</Link>
    ) : (
        <span className={classes}>{content}</span>
    );
};

export default BrandLogo;
