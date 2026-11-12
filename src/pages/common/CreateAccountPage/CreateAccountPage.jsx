import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../services/redux/loadingSlice';
import usuariosApi from '../../../services/apiServices/usuariosApi';
import MessageModal from '../../../components/common/Modals/MessageModal/MessageModal';
import { stringToHash } from '../../../utils/passwordHash';
import BrandLogo from '../../../components/common/BrandLogo/BrandLogo';
import '../LoginPage/LoginPage.css';

const PERFIL_ALUNO = 0;

const CreateAccountPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form, setForm] = useState({ nome: '', email: '', dataNascimento: '', instituicao: '', senha: '', confirmarSenha: '' });
    const [isMessageOpen, setIsMessageOpen] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (form.senha !== form.confirmarSenha) {
            toast.error('As senhas não coincidem.');
            return;
        }
        dispatch(setLoading(true));
        try {
            const response = await usuariosApi.create({
                login: form.email,
                nome: form.nome,
                email: form.email,
                pass: `${stringToHash(form.senha)}`,
                dataNascimento: form.dataNascimento || null,
                instituicao: form.instituicao,
            }, PERFIL_ALUNO);
            if (response.success) {
                setIsMessageOpen(true);
            } else {
                toast.warn('Já existe um usuário com esse email!');
            }
        } catch {
            toast.error('Erro ao criar a conta.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <main className="login-page">
            <MessageModal isOpen={isMessageOpen} click={() => navigate('/entrar')} optionText="Ir para o login" message="Conta criada! Enviamos um email com o link para validar a sua conta." />
            <div className="card border-0 shadow-lg login-card">
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        <BrandLogo size="lg" to="/" />
                    </div>
                    <h1 className="h3 mb-2">Criar conta</h1>
                    <p className="text-body-secondary mb-4">Crie sua conta e comece a praticar</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">Nome</label>
                            <input id="nome" name="nome" type="text" className="form-control" value={form.nome} onChange={handleChange} placeholder="Digite seu nome" autoComplete="name" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} placeholder="Digite seu email" autoComplete="email" required />
                        </div>
                        <div className="row g-3 mb-3">
                            <div className="col-sm-6">
                                <label htmlFor="dataNascimento" className="form-label">Data de nascimento</label>
                                <input id="dataNascimento" name="dataNascimento" type="date" className="form-control" value={form.dataNascimento} onChange={handleChange} />
                            </div>
                            <div className="col-sm-6">
                                <label htmlFor="instituicao" className="form-label">Instituição</label>
                                <input id="instituicao" name="instituicao" type="text" className="form-control" value={form.instituicao} onChange={handleChange} placeholder="Escola ou faculdade" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="senha" className="form-label">Senha</label>
                            <input id="senha" name="senha" type="password" className="form-control" value={form.senha} onChange={handleChange} placeholder="Crie uma senha" autoComplete="new-password" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmarSenha" className="form-label">Confirmar senha</label>
                            <input id="confirmarSenha" name="confirmarSenha" type="password" className="form-control" value={form.confirmarSenha} onChange={handleChange} placeholder="Repita a senha" autoComplete="new-password" required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Criar conta</button>
                    </form>
                    <div className="d-flex flex-wrap justify-content-between gap-2 mt-4 small">
                        <Link to="/" className="link-secondary">Voltar ao início</Link>
                        <Link to="/entrar">Já tenho conta</Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CreateAccountPage;
