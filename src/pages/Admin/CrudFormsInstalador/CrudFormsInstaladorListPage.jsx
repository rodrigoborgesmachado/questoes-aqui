import React from 'react';
import crudFormsInstaladorApi from '../../../services/apiServices/crudFormsInstaladorApi';
import AdminTableList from '../../../components/admin/AdminTableList/AdminTableList';
import { putDateOnPattern } from '../../../utils/functions';

const columns = [
    { label: 'Código', value: (item) => item.codigo },
    { label: 'Versão', value: (item) => item.versao },
    { label: 'Diretório', value: (item) => item.diretorio },
    { label: 'Ativo', value: (item) => (item.ativo === '1' ? 'Sim' : 'Não') },
    { label: 'Criado em', value: (item) => putDateOnPattern(item.created) },
];

const CrudFormsInstaladorListPage = () => (
    <AdminTableList title="Instaladores do CrudForms" description="Versões do instalador do CrudForms." api={crudFormsInstaladorApi} columns={columns} getKey={(item) => item.codigo} getDeleteMessage={(item) => `Deseja excluir o instalador da versão ${item.versao}?`} />
);

export default CrudFormsInstaladorListPage;
