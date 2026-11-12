import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout, selectUserName } from '../../../services/redux/authSlice';
import { applyTheme, getStoredTheme } from '../../../utils/themeMode';
import BrandLogo from '../../common/BrandLogo/BrandLogo';

const iftmMenuItem = { path: '/provas?tipos=IFTM', label: 'IFTM' };
const sisuMenuItem = {
    path: '/sisu', label: 'Sisu', children: [
        { path: '/sisu/notas-de-corte', label: 'Notas de corte', icon: 'bi-mortarboard' },
        { path: '/sisu/calculadora-enem', label: 'Calculadora ENEM', icon: 'bi-calculator' },
    ],
};

const menuItems = [
    { path: '/', label: 'Início', end: true },
    iftmMenuItem,
    { path: '/provas', label: 'Provas' },
    { path: '/questoes', label: 'Questões' },
    sisuMenuItem,
    { path: '/simulados', label: 'Simulados' },
    { path: '/ranking', label: 'Ranking' },
];

const publicMenuItems = [
    { path: '/', label: 'Início', end: true },
    iftmMenuItem,
    { path: '/provas', label: 'Provas' },
    { path: '/questoes', label: 'Questões' },
    sisuMenuItem,
    { path: '/sobre', label: 'Sobre' },
];

const userItems = [
    { path: '/desempenho', label: 'Meu desempenho', icon: 'bi-graph-up' },
    { path: '/historico', label: 'Histórico de respostas', icon: 'bi-clock-history' },
    { path: '/simulados', label: 'Meus simulados', icon: 'bi-stopwatch' },
    { path: '/perfil', label: 'Perfil', icon: 'bi-person' },
];

const ClientHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isIftmActive = location.pathname === '/provas' && new URLSearchParams(location.search).get('tipos') === 'IFTM';
    const isProvasActive = (location.pathname === '/provas' || location.pathname.startsWith('/provas/')) && !isIftmActive;
    const isSisuActive = location.pathname.startsWith('/sisu/');
    const userName = useSelector(selectUserName);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [theme, setTheme] = useState(() => getStoredTheme());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSisuMenuOpen, setIsSisuMenuOpen] = useState(false);
    const sisuMenuRef = useRef(null);

    useEffect(() => {
        if (!isSisuMenuOpen) {
            return;
        }
        const onPointerDown = (event) => {
            if (!sisuMenuRef.current?.contains(event.target)) {
                setIsSisuMenuOpen(false);
            }
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsSisuMenuOpen(false);
                sisuMenuRef.current?.querySelector('button')?.focus();
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isSisuMenuOpen]);

    const closeMenus = () => {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsSisuMenuOpen(false);
    };

    const switchTheme = (nextTheme) => {
        setTheme(applyTheme(nextTheme));
    };

    const handleLogout = () => {
        closeMenus();
        dispatch(logout());
        navigate('/');
        toast.success('Até breve!');
    };

    return (
        <header className="client-header bg-body border-bottom shadow-sm">
            <nav className="navbar navbar-expand-lg py-2">
                <div className="container-xl">
                    <BrandLogo to="/" className="navbar-brand" onClick={closeMenus} />
                    <div className="d-flex align-items-center gap-2 order-lg-last">
                        <button
                            type="button"
                            className="btn btn-outline-secondary rounded-circle theme-toggle-button d-flex align-items-center justify-content-center"
                            onClick={() => switchTheme(theme === 'dark' ? 'light' : 'dark')}
                            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                            title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
                        >
                            <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`} aria-hidden="true"></i>
                        </button>
                        {isAuthenticated ? (
                            <div className="dropdown">
                                <button type="button" className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} aria-expanded={isUserMenuOpen}>
                                    <i className="bi bi-person-circle" aria-hidden="true"></i>
                                    <span className="d-none d-sm-inline text-truncate" style={{ maxWidth: '140px' }}>{userName}</span>
                                    <i className="bi bi-chevron-down small" aria-hidden="true"></i>
                                </button>
                                {isUserMenuOpen && (
                                    <ul className="dropdown-menu client-user-menu show shadow position-absolute">
                                        {userItems.map((item) => (
                                            <li key={item.path}>
                                                <Link to={item.path} className="dropdown-item" onClick={closeMenus}>
                                                    <i className={`bi ${item.icon} me-2`} aria-hidden="true"></i>
                                                    {item.label}
                                                </Link>
                                            </li>
                                        ))}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button type="button" className="dropdown-item" onClick={handleLogout}>
                                                <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>
                                                Sair
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <Link to="/entrar" className="btn btn-primary">Entrar</Link>
                        )}
                        <button type="button" className="navbar-toggler" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu" aria-expanded={isMenuOpen}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav me-auto ms-lg-4 gap-lg-1" onClick={closeMenus}>
                            {(isAuthenticated ? menuItems : publicMenuItems).map((item) => {
                                if (item === sisuMenuItem) {
                                    return (
                                        <li key={item.path} className="nav-item dropdown" ref={sisuMenuRef}>
                                            <button type="button" className={`nav-link dropdown-toggle${isSisuActive ? ' active' : ''}`} aria-expanded={isSisuMenuOpen} aria-controls="client-sisu-links" onClick={(event) => { event.stopPropagation(); setIsSisuMenuOpen((previous) => !previous); setIsUserMenuOpen(false); }}>Sisu</button>
                                            {isSisuMenuOpen && (
                                                <ul id="client-sisu-links" className="dropdown-menu show shadow">
                                                    {item.children.map((child) => <li key={child.path}><Link to={child.path} className={`dropdown-item${location.pathname === child.path ? ' active' : ''}`} aria-current={location.pathname === child.path ? 'page' : undefined}><i className={`bi ${child.icon} me-2`} aria-hidden="true"></i>{child.label}</Link></li>)}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                }
                                const isProvasLink = item === iftmMenuItem || item.path === '/provas';
                                const isActive = item === iftmMenuItem ? isIftmActive : isProvasActive;
                                return (
                                    <li key={item.path} className="nav-item">
                                        {isProvasLink ? (
                                            <Link to={item.path} className={`nav-link${isActive ? ' active' : ''}`} aria-current={isActive ? 'page' : undefined}>{item.label}</Link>
                                        ) : (
                                            <NavLink to={item.path} end={item.end} className="nav-link">{item.label}</NavLink>
                                        )}
                                    </li>
                                );
                            })}
                            {!isAuthenticated && (
                                <li className="nav-item">
                                    <NavLink to="/criar-conta" className="nav-link">Criar conta</NavLink>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default ClientHeader;
