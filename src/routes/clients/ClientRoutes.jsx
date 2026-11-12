import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import ClientLayout from '../../layouts/client/ClientLayout';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../../pages/common/LoginPage/LoginPage';
import RecoverPasswordPage from '../../pages/common/RecoverPasswordPage/RecoverPasswordPage';
import ResetPasswordPage from '../../pages/common/ResetPasswordPage/ResetPasswordPage';
import CreateAccountPage from '../../pages/common/CreateAccountPage/CreateAccountPage';
import ValidateAccountPage from '../../pages/common/ValidateAccountPage/ValidateAccountPage';
import HomePage from '../../pages/client/Home/HomePage';
import ProvasPage from '../../pages/client/Provas/ProvasPage/ProvasPage';
import ProvaQuestoesPage from '../../pages/client/Provas/ProvaQuestoesPage/ProvaQuestoesPage';
import QuestoesPage from '../../pages/client/Questoes/QuestoesPage/QuestoesPage';
import QuestaoPublicaPage from '../../pages/client/Questoes/QuestaoPublicaPage/QuestaoPublicaPage';
import PraticarPage from '../../pages/client/Praticar/PraticarPage';
import SimuladosPage from '../../pages/client/Simulados/SimuladosPage/SimuladosPage';
import SimuladoPage from '../../pages/client/Simulados/SimuladoPage/SimuladoPage';
import SimuladoResultadoPage from '../../pages/client/Simulados/SimuladoResultadoPage/SimuladoResultadoPage';
import AvaliacaoResponderPage from '../../pages/client/Avaliacoes/AvaliacaoResponderPage/AvaliacaoResponderPage';
import AvaliacaoResultadoPage from '../../pages/client/Avaliacoes/AvaliacaoResultadoPage/AvaliacaoResultadoPage';
import HistoricoPage from '../../pages/client/Historico/HistoricoPage';
import DesempenhoPage from '../../pages/client/Desempenho/DesempenhoPage';
import RankingPage from '../../pages/client/Ranking/RankingPage';
import PerfilPage from '../../pages/client/Perfil/PerfilPage';
import SobrePage from '../../pages/client/Institutional/SobrePage';
import PrivacidadePage from '../../pages/client/Institutional/PrivacidadePage';
import TermosPage from '../../pages/client/Institutional/TermosPage';
import ContatoPage from '../../pages/client/Institutional/ContatoPage';

const NotasCortePage = lazy(() => import('../../pages/client/Sisu/NotasCortePage'));
const CalculadoraEnemPage = lazy(() => import('../../pages/client/Sisu/CalculadoraEnemPage'));

const ClientRoutes = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return (
        <Routes>
            <Route path="/entrar" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/criar-conta" element={isAuthenticated ? <Navigate to="/" replace /> : <CreateAccountPage />} />
            <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
            <Route path="/resetpass/:guid" element={<ResetPasswordPage />} />
            <Route path="/valida/:guid" element={<ValidateAccountPage />} />
            <Route element={<ClientLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/sobre" element={<SobrePage />} />
                <Route path="/privacidade" element={<PrivacidadePage />} />
                <Route path="/termos" element={<TermosPage />} />
                <Route path="/contato" element={<ContatoPage />} />
                <Route path="/sisu/notas-de-corte" element={<Suspense fallback={<p role="status">Carregando notas de corte...</p>}><NotasCortePage /></Suspense>} />
                <Route path="/sisu/calculadora-enem" element={<Suspense fallback={<p role="status">Carregando calculadora...</p>}><CalculadoraEnemPage /></Suspense>} />
                <Route path="/notasCorte" element={<Navigate to="/sisu/notas-de-corte" replace />} />
                <Route path="/calculadoraEnem" element={<Navigate to="/sisu/calculadora-enem" replace />} />
                <Route path="/provas" element={<ProvasPage />} />
                <Route path="/provas/:provaId" element={<ProvaQuestoesPage />} />
                <Route path="/questoes" element={<QuestoesPage />} />
                <Route path="/questoes/:id" element={<QuestaoPublicaPage />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/praticar" element={<PraticarPage />} />
                    <Route path="/simulados" element={<SimuladosPage />} />
                    <Route path="/simulados/prova/:provaId" element={<SimuladoPage />} />
                    <Route path="/simulados/resultado/:id" element={<SimuladoResultadoPage />} />
                    <Route path="/avaliacoes/:id" element={<AvaliacaoResponderPage />} />
                    <Route path="/avaliacoes/:id/resultado" element={<AvaliacaoResultadoPage />} />
                    <Route path="/historico" element={<HistoricoPage />} />
                    <Route path="/desempenho" element={<DesempenhoPage />} />
                    <Route path="/ranking" element={<RankingPage />} />
                    <Route path="/perfil" element={<PerfilPage />} />
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default ClientRoutes;
