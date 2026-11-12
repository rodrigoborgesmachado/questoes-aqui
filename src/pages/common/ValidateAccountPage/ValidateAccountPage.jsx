import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import usuariosApi from '../../../services/apiServices/usuariosApi';
import BrandLogo from '../../../components/common/BrandLogo/BrandLogo';
import '../LoginPage/LoginPage.css';

const ValidateAccountPage = () => {
    const { guid } = useParams();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const validate = async () => {
            try {
                const response = await usuariosApi.liberaUser(guid);
                setStatus(response.success ? 'success' : 'error');
            } catch {
                setStatus('error');
            }
        };
        validate();
    }, [guid]);

    return (
        <main className="login-page">
            <div className="card border-0 shadow-lg login-card">
                <div className="card-body p-4 p-md-5 text-center">
                    <div className="mb-4">
                        <BrandLogo size="lg" to="/" />
                    </div>
                    <h1 className="h3 mb-4">Validar conta</h1>
                    {status === 'loading' && (
                        <>
                            <div className="spinner-border text-app-primary mb-3" role="status"></div>
                            <p className="text-body-secondary mb-0">Validando a sua conta...</p>
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <i className="bi bi-patch-check-fill display-4 text-success" aria-hidden="true"></i>
                            <p className="mt-3 mb-4">Conta validada com sucesso! Seu login está liberado.</p>
                            <Link to="/entrar" className="btn btn-primary w-100">Entrar</Link>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <i className="bi bi-x-octagon-fill display-4 text-danger" aria-hidden="true"></i>
                            <p className="mt-3 mb-4">Não foi possível validar a conta. O link pode estar inválido ou já ter sido usado.</p>
                            <Link to="/" className="btn btn-outline-secondary w-100">Voltar ao início</Link>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ValidateAccountPage;
