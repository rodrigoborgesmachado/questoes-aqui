import React from 'react';
import veiculosForDevApi from '../../../services/apiServices/veiculosForDevApi';
import AdminTableList from '../../../components/admin/AdminTableList/AdminTableList';

const columns = [
    { label: 'Renavam', value: (item) => item.renavam },
    { label: 'Placa', value: (item) => item.placaVeiculo },
    { label: 'Marca', value: (item) => item.marca },
    { label: 'Modelo', value: (item) => item.modelo },
    { label: 'Ano', value: (item) => item.ano },
    { label: 'Cor', value: (item) => item.cor },
];

const VeiculosForDevListPage = () => (
    <AdminTableList title="Veículos" description="Veículos usados pelos geradores do Data Spark." api={veiculosForDevApi} columns={columns} getKey={(item) => item.renavam} getDeleteMessage={(item) => `Deseja excluir o veículo ${item.placaVeiculo} (${item.renavam})?`} />
);

export default VeiculosForDevListPage;
