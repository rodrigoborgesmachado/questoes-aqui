import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../services/redux/loadingSlice';
import tokenApi from '../../../services/apiServices/token';
import MessageModal from '../../../components/common/Modals/MessageModal/MessageModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../LoginPage/LoginPage.css';

const RecoverPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRecover = async (event) => {
        event.preventDefault();
        dispatch(setLoading(true));
        try {
            const response = await tokenApi.recoverPass(email);
            if (response.success) {
                setIsMessageOpen(true);
            } else {
                toast.error('Usuário não encontrado!');
            }
        } catch {
            toast.error('Erro ao solicitar recuperação de senha.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <main className="login-page">
            <MessageModal isOpen={isMessageOpen} click={() => navigate('/entrar')} message="Você receberá um email com as instruções para recuperação da senha!" />
            <div className="card border-0 shadow-lg login-card">
                <div className="card-body p-4 p-md-5">
                    <h1 className="h3 mb-2">Questões Aqui</h1>
                    <p className="text-body-secondary mb-4">Recuperação de senha</p>
                    <form onSubmit={handleRecover}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input id="email" type="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Digite seu email cadastrado" required />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Recuperar senha</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/entrar')}>Voltar</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default RecoverPasswordPage;
