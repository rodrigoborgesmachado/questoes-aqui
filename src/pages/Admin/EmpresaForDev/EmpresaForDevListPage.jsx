import React from 'react';
import empresaForDevApi from '../../../services/apiServices/empresaForDevApi';
import AdminTableList from '../../../components/admin/AdminTableList/AdminTableList';

const columns = [
    { label: 'CNPJ', value: (item) => item.cnpj },
    { label: 'Nome', value: (item) => item.nome },
    { label: 'Email', value: (item) => item.email },
    { label: 'Cidade', value: (item) => item.cidade },
    { label: 'Estado', value: (item) => item.estado },
];

const EmpresaForDevListPage = () => (
    <AdminTableList title="Empresas" description="Empresas usadas pelos geradores do Data Spark." api={empresaForDevApi} columns={columns} getKey={(item) => item.cnpj} getDeleteMessage={(item) => `Deseja excluir a empresa ${item.nome} (${item.cnpj})?`} />
);

export default EmpresaForDevListPage;
