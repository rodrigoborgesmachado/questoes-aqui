import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMaisGroups } from '../../../components/client/ClientBottomNav/bottomNavItems';

const MaisPage = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return (
        <div className="d-flex flex-column gap-4">
            <h1 className="h3 mb-0">Mais</h1>
            {getMaisGroups(isAuthenticated).map((group) => (
                <nav key={group.title} aria-label={group.title}>
                    <h2 className="h6 text-body-secondary text-uppercase mb-2">{group.title}</h2>
                    <div className="list-group shadow-sm">
                        {group.links.map((link) => {
                            const content = (
                                <>
                                    <i className={`bi ${link.icon} text-primary`} aria-hidden="true"></i>
                                    <span className="flex-grow-1">{link.label}</span>
                                    <i className="bi bi-chevron-right small text-body-secondary" aria-hidden="true"></i>
                                </>
                            );
                            const classes = 'list-group-item list-group-item-action d-flex align-items-center gap-3 py-3';
                            return link.href ? (
                                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={classes}>{content}</a>
                            ) : (
                                <Link key={link.path} to={link.path} className={classes}>{content}</Link>
                            );
                        })}
                    </div>
                </nav>
            ))}
        </div>
    );
};

export default MaisPage;
