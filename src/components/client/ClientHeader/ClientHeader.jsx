import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout, selectUserFoto, selectUserName, setUserView } from '../../../services/redux/authSlice';
import { ehApp } from '../../../services/plataforma';
import { applyColor, applyTheme, getStoredColor, getStoredTheme, themeColors } from '../../../utils/themeMode';
import BrandLogo from '../../common/BrandLogo/BrandLogo';

const tipoMenuItems = ['IFTM', 'UFU', 'ENEM'].map((tipo) => ({ path: `/provas?tipos=${tipo}`, label: tipo, tipo }));
const sisuMenuItem = {
    path: '/sisu', label: 'Sisu', children: [
        { path: '/sisu/notas-de-corte', label: 'Notas de corte', icon: 'bi-mortarboard' },
        { path: '/sisu/calculadora-enem', label: 'Calculadora ENEM', icon: 'bi-calculator' },
    ],
};

const menuItems = [
    { path: '/', label: 'Início', end: true },
    ...tipoMenuItems,
    { path: '/provas', label: 'Provas' },
    { path: '/questoes', label: 'Questões' },
    sisuMenuItem,
    { path: '/simulados', label: 'Simulados' },
    { path: '/ranking', label: 'Ranking' },
];

const publicMenuItems = [
    { path: '/', label: 'Início', end: true },
    ...tipoMenuItems,
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
    const activeTipo = location.pathname === '/provas' ? tipoMenuItems.find((item) => item.tipo === new URLSearchParams(location.search).get('tipos'))?.tipo : undefined;
    const isProvasActive = (location.pathname === '/provas' || location.pathname.startsWith('/provas/')) && !activeTipo;
    const isSisuActive = location.pathname.startsWith('/sisu/');
    const userName = useSelector(selectUserName);
    const userFoto = useSelector(selectUserFoto);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const [theme, setTheme] = useState(() => getStoredTheme());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSisuMenuOpen, setIsSisuMenuOpen] = useState(false);
    const [color, setColor] = useState(() => getStoredColor());
    const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
    const sisuMenuRef = useRef(null);
    const colorMenuRef = useRef(null);
    const app = ehApp();

    useEffect(() => {
        if (!isColorMenuOpen) {
            return;
        }
        const onPointerDown = (event) => {
            if (!colorMenuRef.current?.contains(event.target)) {
                setIsColorMenuOpen(false);
            }
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsColorMenuOpen(false);
                colorMenuRef.current?.querySelector('button')?.focus();
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isColorMenuOpen]);

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
        setIsColorMenuOpen(false);
    };

    const switchTheme = (nextTheme) => {
        setTheme(applyTheme(nextTheme));
    };

    const switchColor = (nextColor) => {
        setColor(applyColor(nextColor));
        setIsColorMenuOpen(false);
    };

    const handleAdminView = () => {
        closeMenus();
        dispatch(setUserView(false));
        navigate('/');
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
                <div className="container-xl position-relative">
                    <BrandLogo to="/" className="navbar-brand" onClick={closeMenus} />
                    <div className="d-flex align-items-center gap-2 order-lg-last">
                        <div ref={colorMenuRef}>
                            <button
                                type="button"
                                className="btn btn-outline-secondary rounded-circle theme-toggle-button d-flex align-items-center justify-content-center"
                                onClick={() => { setIsColorMenuOpen(!isColorMenuOpen); setIsUserMenuOpen(false); }}
                                aria-label="Escolher tema de cores"
                                aria-expanded={isColorMenuOpen}
                                aria-controls="client-color-themes"
                                title="Tema de cores"
                            >
                                <i className="bi bi-palette" aria-hidden="true"></i>
                            </button>
                            {isColorMenuOpen && (
                                <div id="client-color-themes" className="dropdown-menu client-color-menu show shadow position-absolute p-2">
                                    {themeColors.map((item) => (
                                        <button key={item.id} type="button" data-cor={item.id} className={`client-color-option${item.id === color ? ' active' : ''}`} onClick={() => switchColor(item.id)} aria-pressed={item.id === color}>
                                            <span className="client-color-swatch" aria-hidden="true">{item.icone}</span>
                                            <span className="small text-truncate">{item.nome}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
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
                                    {userFoto ? <img src={userFoto} alt="" className="rounded-circle" width="24" height="24" style={{ objectFit: 'cover' }} /> : <i className="bi bi-person-circle" aria-hidden="true"></i>}
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
                                        {isAdmin && (
                                            <li>
                                                <button type="button" className="dropdown-item" onClick={handleAdminView}>
                                                    <i className="bi bi-speedometer2 me-2" aria-hidden="true"></i>
                                                    Voltar para visão admin
                                                </button>
                                            </li>
                                        )}
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
                        <button type="button" className={`navbar-toggler${app ? ' d-none' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu" aria-expanded={isMenuOpen}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}${app ? ' d-none' : ''}`}>
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
                                const isProvasLink = Boolean(item.tipo) || item.path === '/provas';
                                const isActive = item.tipo ? item.tipo === activeTipo : isProvasActive;
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
