import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../../layouts/admin/AdminLayout';
import DashboardPage from '../../pages/admin/DashBoard/DashboardPage';
import ProvaListPage from '../../pages/admin/Prova/ProvaListPage/ProvaListPage';
import ProvaForm from '../../pages/admin/Prova/ProvaForm/ProvaForm';
import QuestoesListPage from '../../pages/admin/Questoes/QuestoesListPage/QuestoesListPage';
import QuestoesForm from '../../pages/admin/Questoes/QuestoesForm/QuestoesForm';
import AvaliacaoListPage from '../../pages/admin/Avaliacao/AvaliacaoListPage/AvaliacaoListPage';
import AvaliacaoPage from '../../pages/admin/Avaliacao/AvaliacaoPage/AvaliacaoPage';
import RespostasavaliacoesListPage from '../../pages/admin/Respostasavaliacoes/RespostasavaliacoesListPage/RespostasavaliacoesListPage';
import RespostasavaliacoesPage from '../../pages/admin/Respostasavaliacoes/RespostasavaliacoesPage/RespostasavaliacoesPage';
import NotascortesisuListPage from '../../pages/admin/Notascortesisu/NotascortesisuListPage/NotascortesisuListPage';
import NotascortesisuPage from '../../pages/admin/Notascortesisu/NotascortesisuPage/NotascortesisuPage';
import NotascortesisuForm from '../../pages/admin/Notascortesisu/NotascortesisuForm/NotascortesisuForm';
import UsuariosListPage from '../../pages/admin/Usuarios/UsuariosListPage/UsuariosListPage';
import LogsListPage from '../../pages/admin/Logs/LogsListPage/LogsListPage';
import HistoricoUsuariosPage from '../../pages/admin/HistoricoUsuarios/HistoricoUsuariosPage';
import HistoricoRespostasListPage from '../../pages/admin/HistoricoRespostas/HistoricoRespostasListPage';
import HistoricoTabuadaDivertidaListPage from '../../pages/admin/HistoricoTabuadaDivertida/HistoricoTabuadaDivertidaListPage';

const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/provas" element={<ProvaListPage />} />
      <Route path="/provas/novo" element={<ProvaForm />} />
      <Route path="/provas/:id/editar" element={<ProvaForm />} />
      <Route path="/provas/:provaId" element={<Navigate to="questoes" replace />} />
      <Route path="/provas/:provaId/questoes" element={<QuestoesListPage key="prova" />} />
      <Route path="/provas/:provaId/questoes/novo" element={<QuestoesForm />} />
      <Route path="/questoes" element={<QuestoesListPage key="geral" />} />
      <Route path="/questoes/:id" element={<Navigate to="editar" replace />} />
      <Route path="/questoes/:id/editar" element={<QuestoesForm />} />
      <Route path="/avaliacoes" element={<AvaliacaoListPage />} />
      <Route path="/avaliacoes/:id" element={<AvaliacaoPage />} />
      <Route path="/respostas-avaliacoes" element={<RespostasavaliacoesListPage />} />
      <Route path="/respostas-avaliacoes/:id" element={<RespostasavaliacoesPage />} />
      <Route path="/notas-de-corte" element={<NotascortesisuListPage />} />
      <Route path="/notas-de-corte/novo" element={<NotascortesisuForm />} />
      <Route path="/notas-de-corte/:id/editar" element={<NotascortesisuForm />} />
      <Route path="/notas-de-corte/:id" element={<NotascortesisuPage />} />
      <Route path="/usuarios" element={<UsuariosListPage />} />
      <Route path="/logs" element={<LogsListPage />} />
      <Route path="/historico-usuarios" element={<HistoricoUsuariosPage />} />
      <Route path="/historico-respostas" element={<HistoricoRespostasListPage />} />
      <Route path="/historico-tabuada-divertida" element={<HistoricoTabuadaDivertidaListPage />} />
      <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>
  </AdminLayout>
);

export default AdminRoutes;
