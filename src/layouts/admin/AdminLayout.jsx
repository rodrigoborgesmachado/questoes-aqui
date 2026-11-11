import React, { useState } from 'react';
import './AdminLayout.css';
import AdminSidebar from '../../components/admin/AdminSidebar/AdminSidebar';
import { useLocation, Link } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader/AdminHeader';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="admin-layout d-flex bg-body-tertiary">
            <div className={`admin-sidebar-shell d-lg-block ${isSidebarOpen ? 'visible' : ''}`}>
                <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
            </div>
            {isSidebarOpen && <div className="sidebar-overlay d-lg-none" onClick={() => setIsSidebarOpen(false)}></div>}

            <div className="admin-main flex-grow-1 d-flex flex-column">
                <AdminHeader onclickMenu={() => setIsSidebarOpen(true)} />
                <main className="admin-children mx-auto p-3 p-lg-4 flex-grow-1">
                    {pathSegments.length > 0 && (
                        <nav aria-label="breadcrumb" className="mb-3">
                            <ol className="breadcrumb small mb-0">
                                <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
                                {pathSegments.map((segment, index) => {
                                    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
                                    const isLast = index === pathSegments.length - 1;
                                    return isLast ? (
                                        <li key={path} className="breadcrumb-item active" aria-current="page">{decodeURIComponent(segment)}</li>
                                    ) : (
                                        <li key={path} className="breadcrumb-item"><Link to={path}>{decodeURIComponent(segment)}</Link></li>
                                    );
                                })}
                            </ol>
                        </nav>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
