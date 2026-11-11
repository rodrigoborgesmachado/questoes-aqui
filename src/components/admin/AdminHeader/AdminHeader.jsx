import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserName } from '../../../services/redux/authSlice';
import { applyTheme, getStoredTheme } from '../../../utils/themeMode';

const AdminHeader = ({ onclickMenu }) => {
    const userName = useSelector(selectUserName);
    const [theme, setTheme] = useState(() => getStoredTheme());

    useEffect(() => {
        setTheme(applyTheme(theme));
    }, [theme]);

    const switchTheme = (nextTheme) => {
        setTheme(applyTheme(nextTheme));
    };

    return (
        <header className="admin-header bg-body border-bottom">
            <div className="d-flex align-items-center justify-content-between gap-3 px-3 py-2 w-100">
                <div className="d-flex align-items-center gap-3">
                    <button type="button" className="btn btn-outline-secondary d-lg-none" onClick={onclickMenu} aria-label="Abrir menu">
                        <i className="bi bi-list" aria-hidden="true"></i>
                    </button>
                    <h1 className="h5 mb-0">Questões Aqui</h1>
                </div>
                <div className="d-flex align-items-center gap-2 text-body-secondary">
                    <button
                        type="button"
                        className={`btn btn-outline-secondary rounded-circle theme-toggle-button d-flex align-items-center justify-content-center ${theme === 'dark' ? 'd-none' : ''}`}
                        onClick={() => switchTheme('dark')}
                        aria-label="Ativar tema escuro"
                        title="Tema escuro"
                    >
                        <i className="bi bi-moon" aria-hidden="true"></i>
                    </button>
                    <button
                        type="button"
                        className={`btn btn-outline-secondary rounded-circle theme-toggle-button d-flex align-items-center justify-content-center ${theme === 'light' ? 'd-none' : ''}`}
                        onClick={() => switchTheme('light')}
                        aria-label="Ativar tema claro"
                        title="Tema claro"
                    >
                        <i className="bi bi-sun" aria-hidden="true"></i>
                    </button>
                    <span className="d-none d-sm-inline">Olá, {userName}</span>
                    <i className="bi bi-person-circle fs-4" aria-hidden="true"></i>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
