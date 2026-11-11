import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getLoginUrl } from '../../utils/functions';

const PrivateRoute = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={getLoginUrl(`${location.pathname}${location.search}`)} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
