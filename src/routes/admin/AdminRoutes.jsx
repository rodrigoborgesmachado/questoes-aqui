import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../../layouts/admin/AdminLayout';
import DashboardPage from '../../pages/Admin/DashBoard/DashboardPage';
import ProvaListPage from '../../pages/Admin/Prova/ProvaListPage/ProvaListPage';
import ProvaForm from '../../pages/Admin/Prova/ProvaForm/ProvaForm';
import QuestoesListPage from '../../pages/Admin/Questoes/QuestoesListPage/QuestoesListPage';
import QuestoesForm from '../../pages/Admin/Questoes/QuestoesForm/QuestoesForm';
import AvaliacaoListPage from '../../pages/Admin/Avaliacao/AvaliacaoListPage/AvaliacaoListPage';
import AvaliacaoPage from '../../pages/Admin/Avaliacao/AvaliacaoPage/AvaliacaoPage';
import RespostasavaliacoesListPage from '../../pages/Admin/Respostasavaliacoes/RespostasavaliacoesListPage/RespostasavaliacoesListPage';
import RespostasavaliacoesPage from '../../pages/Admin/Respostasavaliacoes/RespostasavaliacoesPage/RespostasavaliacoesPage';
import NotascortesisuListPage from '../../pages/Admin/Notascortesisu/NotascortesisuListPage/NotascortesisuListPage';
import NotascortesisuPage from '../../pages/Admin/Notascortesisu/NotascortesisuPage/NotascortesisuPage';
import NotascortesisuForm from '../../pages/Admin/Notascortesisu/NotascortesisuForm/NotascortesisuForm';
import UsuariosListPage from '../../pages/Admin/Usuarios/UsuariosListPage/UsuariosListPage';
import LogsListPage from '../../pages/Admin/Logs/LogsListPage/LogsListPage';
import EmailsListPage from '../../pages/Admin/Emails/EmailsListPage/EmailsListPage';
import HistoricoUsuariosPage from '../../pages/Admin/HistoricoUsuarios/HistoricoUsuariosPage';
import HistoricoRespostasListPage from '../../pages/Admin/HistoricoRespostas/HistoricoRespostasListPage';
import HistoricoTabuadaDivertidaListPage from '../../pages/Admin/HIstoricoTabuadaDivertida/HistoricoTabuadaDivertidaListPage';
import ResultadosJogosListPage from '../../pages/Admin/ResultadosJogos/ResultadosJogosListPage';
import UsuariosCrudFormsListPage from '../../pages/Admin/UsuariosCrudForms/UsuariosCrudFormsListPage';
import CrudFormsInstaladorListPage from '../../pages/Admin/CrudFormsInstalador/CrudFormsInstaladorListPage';
import PessoasForDevListPage from '../../pages/Admin/PessoasForDev/PessoasForDevListPage';
import EmpresaForDevListPage from '../../pages/Admin/EmpresaForDev/EmpresaForDevListPage';
import CartaoCreditoDevToolsListPage from '../../pages/Admin/CartaoCreditoDevTools/CartaoCreditoDevToolsListPage';
import VeiculosForDevListPage from '../../pages/Admin/VeiculosForDev/VeiculosForDevListPage';

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
      <Route path="/emails" element={<EmailsListPage />} />
      <Route path="/historico-usuarios" element={<HistoricoUsuariosPage />} />
      <Route path="/historico-respostas" element={<HistoricoRespostasListPage />} />
      <Route path="/historico-tabuada-divertida" element={<HistoricoTabuadaDivertidaListPage />} />
      <Route path="/tabuada-divertida" element={<Navigate to="resultados-jogos" replace />} />
      <Route path="/tabuada-divertida/resultados-jogos" element={<ResultadosJogosListPage />} />
      <Route path="/crud-forms" element={<Navigate to="usuarios" replace />} />
      <Route path="/crud-forms/usuarios" element={<UsuariosCrudFormsListPage />} />
      <Route path="/crud-forms/instaladores" element={<CrudFormsInstaladorListPage />} />
      <Route path="/data-spark" element={<Navigate to="pessoas" replace />} />
      <Route path="/data-spark/pessoas" element={<PessoasForDevListPage />} />
      <Route path="/data-spark/empresas" element={<EmpresaForDevListPage />} />
      <Route path="/data-spark/cartoes-credito" element={<CartaoCreditoDevToolsListPage />} />
      <Route path="/data-spark/veiculos" element={<VeiculosForDevListPage />} />
      <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>
  </AdminLayout>
);

export default AdminRoutes;
