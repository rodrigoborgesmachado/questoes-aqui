import React from 'react';
import pessoasForDevApi from '../../../services/apiServices/pessoasForDevApi';
import AdminTableList from '../../../components/admin/AdminTableList/AdminTableList';

const columns = [
    { label: 'CPF', value: (item) => item.cpf },
    { label: 'Nome', value: (item) => item.nome },
    { label: 'Idade', value: (item) => item.idade },
    { label: 'Email', value: (item) => item.email },
    { label: 'Cidade', value: (item) => item.cidade },
    { label: 'Estado', value: (item) => item.estado },
];

const PessoasForDevListPage = () => (
    <AdminTableList title="Pessoas" description="Pessoas usadas pelos geradores do Data Spark." api={pessoasForDevApi} columns={columns} getKey={(item) => item.cpf} getDeleteMessage={(item) => `Deseja excluir a pessoa ${item.nome} (${item.cpf})?`} />
);

export default PessoasForDevListPage;
