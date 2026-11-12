import React from 'react';
import usuariosCrudFormsApi from '../../../services/apiServices/usuariosCrudFormsApi';
import AdminTableList from '../../../components/admin/AdminTableList/AdminTableList';
import { putDateOnPattern } from '../../../utils/functions';

const columns = [
    { label: 'Código', value: (item) => item.codigo },
    { label: 'Login', value: (item) => item.login },
    { label: 'Nome', value: (item) => item.nome },
    { label: 'Email', value: (item) => item.email },
    { label: 'Administrador', value: (item) => (item.administrador === '1' ? 'Sim' : 'Não') },
    { label: 'Desenvolvedor', value: (item) => (item.desenvolvedor === '1' ? 'Sim' : 'Não') },
    { label: 'Criado em', value: (item) => putDateOnPattern(item.created) },
];

const UsuariosCrudFormsListPage = () => (
    <AdminTableList title="Usuários do CrudForms" description="Usuários cadastrados no CrudForms." api={usuariosCrudFormsApi} columns={columns} getKey={(item) => item.codigo} getDeleteMessage={(item) => `Deseja excluir o usuário #${item.codigo} (${item.login})?`} />
);

export default UsuariosCrudFormsListPage;
