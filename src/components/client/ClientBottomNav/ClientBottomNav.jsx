import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { getBottomNavItems, isFocusPath } from './bottomNavItems';
import './ClientBottomNav.css';

const ClientBottomNav = () => {
    const { pathname } = useLocation();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (isFocusPath(pathname)) {
        return null;
    }

    return (
        <>
            <div className="client-bottom-nav-spacer" aria-hidden="true"></div>
            <nav className="client-bottom-nav bg-body border-top" aria-label="Navegação do app">
                {getBottomNavItems(isAuthenticated).map((item) => {
                    const isActive = item.isActive(pathname);
                    return (
                        <Link key={item.path} to={item.path} className={`client-bottom-nav-item${isActive ? ' active' : ''}`} aria-current={isActive ? 'page' : undefined}>
                            <i className={`bi ${item.icon}`} aria-hidden="true"></i>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
};

export default ClientBottomNav;
