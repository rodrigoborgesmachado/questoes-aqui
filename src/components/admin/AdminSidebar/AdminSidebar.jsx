import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../../services/redux/authSlice';
import { toast } from 'react-toastify';
import { findActiveGroupKey, isItemActive, menuGroups } from './adminMenu';

const AdminSidebar = ({ onNavigate }) => {
    const location = useLocation();
    const activeGroupKey = findActiveGroupKey(location.pathname);
    const [openGroups, setOpenGroups] = useState(() => new Set([activeGroupKey]));
    const [lastActiveGroupKey, setLastActiveGroupKey] = useState(activeGroupKey);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (activeGroupKey !== lastActiveGroupKey) {
        setLastActiveGroupKey(activeGroupKey);
        if (activeGroupKey && !openGroups.has(activeGroupKey)) {
            setOpenGroups(new Set(openGroups).add(activeGroupKey));
        }
    }

    const toggleGroup = (key) => {
        setOpenGroups((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        toast.success('Até breve!');
    };

    return (
        <aside className="admin-sidebar d-flex flex-column flex-shrink-0 p-3 text-white">
            <div className="d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-mortarboard-fill fs-3" aria-hidden="true"></i>
                <span className="fs-5 fw-semibold">Questões Aqui</span>
            </div>
            <nav className="nav nav-pills flex-column gap-1 flex-grow-1">
                {menuGroups.map((group) => {
                    const isOpen = openGroups.has(group.key);
                    return (
                        <div key={group.key} className="admin-sidebar-group">
                            <button type="button" className="admin-sidebar-group-toggle nav-link w-100 d-flex align-items-center text-start" aria-expanded={isOpen} aria-controls={`admin-menu-${group.key}`} onClick={() => toggleGroup(group.key)}>
                                <i className={`bi ${group.icon} me-2`} aria-hidden="true"></i>
                                <span className="flex-grow-1 fw-semibold">{group.label}</span>
                                <i className={`bi ${isOpen ? 'bi-chevron-down' : 'bi-chevron-right'} small`} aria-hidden="true"></i>
                            </button>
                            {isOpen && (
                                <div id={`admin-menu-${group.key}`} className="admin-sidebar-group-items d-flex flex-column gap-1 mt-1">
                                    {group.items.map((item) => (
                                        <Link key={item.path} to={`/${item.path}`} onClick={onNavigate} className={isItemActive(item, location.pathname) ? 'nav-link active' : 'nav-link'}>
                                            <i className={`bi ${item.icon} me-2`} aria-hidden="true"></i>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
            <button type="button" className="btn btn-outline-light w-100 mt-3" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>
                Sair
            </button>
        </aside>
    );
};

export default AdminSidebar;
