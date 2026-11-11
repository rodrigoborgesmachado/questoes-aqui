import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../../services/redux/authSlice';
import { toast } from 'react-toastify';

const menuItems = [
    { path: '', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: 'provas', label: 'Provas', icon: 'bi-book' },
    { path: 'questoes', label: 'Questões', icon: 'bi-folder' },
    { path: 'avaliacoes', label: 'Avaliações', icon: 'bi-clipboard-check' },
    { path: 'respostas-avaliacoes', label: 'Respostas das Avaliações', icon: 'bi-ui-checks' },
    { path: 'notas-de-corte', label: 'Notas de corte do Sisu', icon: 'bi-graph-up' },
    { path: 'usuarios', label: 'Usuários', icon: 'bi-person' },
    { path: 'historico-usuarios', label: 'Histórico de usuários', icon: 'bi-person-lines-fill' },
    { path: 'historico-respostas', label: 'Histórico de respostas', icon: 'bi-clock-history' },
    { path: 'historico-tabuada-divertida', label: 'Histórico Tabuada Divertida', icon: 'bi-calculator' },
    { path: 'logs', label: 'Logs', icon: 'bi-journal-text' },
];

const AdminSidebar = ({ onNavigate }) => {
    const location = useLocation();
    const currentSegment = location.pathname.split('/').filter(Boolean)[0] ?? '';
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                {menuItems.map((item) => (
                    <Link key={item.path} to={`/${item.path}`} onClick={onNavigate} className={currentSegment === item.path ? 'nav-link active' : 'nav-link'}>
                        <i className={`bi ${item.icon} me-2`} aria-hidden="true"></i>
                        {item.label}
                    </Link>
                ))}
            </nav>
            <button type="button" className="btn btn-outline-light w-100 mt-3" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>
                Sair
            </button>
        </aside>
    );
};

export default AdminSidebar;
