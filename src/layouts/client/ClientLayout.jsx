import React, { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ClientHeader from '../../components/client/ClientHeader/ClientHeader';
import ClientFooter from '../../components/client/ClientFooter/ClientFooter';
import './ClientLayout.css';

const ClientLayout = () => {
    const { pathname, hash } = useLocation();

    useLayoutEffect(() => {
        if (hash) {
            document.getElementById(hash.slice(1))?.scrollIntoView();
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }, [pathname, hash]);

    return (
        <div className="client-layout d-flex flex-column bg-body-tertiary">
            <ClientHeader />
            <main className="client-main container-xl flex-grow-1 py-4 py-lg-5">
                <Outlet />
            </main>
            <ClientFooter />
        </div>
    );
};

export default ClientLayout;
