import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../../services/redux/authSlice';
import tokenApi from '../../../services/apiServices/token';
import './LoginPage.css';
import { setLoading } from '../../../services/redux/loadingSlice';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (searchParams.get('reason') === 'session-expired') {
            toast.info('Sessão expirada. Faça login novamente.');
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            dispatch(setLoading(true));
            const response = await tokenApi.getToken({ userName: identifier, password });
            const returnUrl = searchParams.get('returnUrl');
            dispatch(login({
                access_token: response.token,
                name: response.nome,
                code: response.Id ?? response.id,
                admin: response.admin,
            }));
            navigate(`${response.admin}` !== '1' && returnUrl?.startsWith('/') ? returnUrl : '/', { replace: true });
            toast.success('Bem vindo!');
        } catch {
            setError('Falha na autenticação. Verifique seus dados e tente novamente.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <main className="login-page">
            <div className="card border-0 shadow-lg login-card">
                <div className="card-body p-4 p-md-5">
                    <h1 className="h3 mb-2">Questões Aqui</h1>
                    <p className="text-body-secondary mb-4">Acesse sua conta</p>
                    {searchParams.get('returnUrl') && <div className="alert alert-info py-2 small" role="status">Entre na sua conta para continuar.</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="identifier" className="form-label">Email</label>
                            <input id="identifier" type="email" className="form-control" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Digite seu email" autoComplete="username" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Senha</label>
                            <input id="password" type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" autoComplete="current-password" required />
                        </div>
                        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                        <div className="d-flex justify-content-end mb-3">
                            <Link to="/recuperar-senha" className="link-secondary small">Esqueceu a senha?</Link>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Acessar</button>
                    </form>
                    <div className="d-flex flex-wrap justify-content-between gap-2 mt-4 small">
                        <Link to="/" className="link-secondary">Voltar ao início</Link>
                        <Link to="/criar-conta">Criar uma conta</Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
