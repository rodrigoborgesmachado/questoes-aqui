import React from 'react';
import cartaoCreditoDevToolsApi from '../../../services/apiServices/cartaoCreditoDevToolsApi';
import AdminTableList from '../../../components/admin/AdminTableList/AdminTableList';

const columns = [
    { label: 'Número', value: (item) => item.numeroCartao },
    { label: 'Validade', value: (item) => item.dataValidade },
    { label: 'Código de segurança', value: (item) => item.codigoSeguranca },
    { label: 'Criado em', value: (item) => item.created },
];

const CartaoCreditoDevToolsListPage = () => (
    <AdminTableList title="Cartões de crédito" description="Cartões de crédito usados pelos geradores do Data Spark." api={cartaoCreditoDevToolsApi} columns={columns} getKey={(item) => item.numeroCartao} getDeleteMessage={(item) => `Deseja excluir o cartão ${item.numeroCartao}?`} />
);

export default CartaoCreditoDevToolsListPage;
