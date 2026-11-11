import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../services/redux/loadingSlice';
import tokenApi from '../../../services/apiServices/token';
import { toast } from 'react-toastify';
import '../LoginPage/LoginPage.css';

const ResetPasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { guid } = useParams();
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== verifyPassword) {
            toast.error('As senhas não coincidem.');
            return;
        }
        dispatch(setLoading(true));
        try {
            const response = await tokenApi.resetPass(guid, password);
            if (response.success) {
                toast.success('Login liberado com a nova senha!');
                navigate('/entrar');
            } else {
                toast.error('Link inválido ou expirado. Solicite a recuperação novamente.');
            }
        } catch {
            toast.error('Erro ao atualizar a senha.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <main className="login-page">
            <div className="card border-0 shadow-lg login-card">
                <div className="card-body p-4 p-md-5">
                    <h1 className="h3 mb-2">Questões Aqui</h1>
                    <p className="text-body-secondary mb-4">Defina uma nova senha para acessar sua conta.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Nova senha</label>
                            <input id="password" type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite a nova senha" autoComplete="new-password" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="verifyPassword" className="form-label">Confirmar senha</label>
                            <input id="verifyPassword" type="password" className="form-control" value={verifyPassword} onChange={(event) => setVerifyPassword(event.target.value)} placeholder="Confirme a nova senha" autoComplete="new-password" required />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Confirmar</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/entrar')}>Voltar</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ResetPasswordPage;
