import React from 'react';
import resultadosJogosApi from '../../../services/apiServices/resultadosJogosApi';
import AdminTableList from '../../../components/admin/AdminTableList/AdminTableList';
import { putDateOnPattern } from '../../../utils/functions';

const columns = [
    { label: 'Id', value: (item) => item.Id },
    { label: 'Jogo', value: (item) => item.jogo },
    { label: 'Modo', value: (item) => item.modo },
    { label: 'Nome', value: (item) => item.nome },
    { label: 'Pontuação', value: (item) => item.pontuacao },
    { label: 'Tempo', value: (item) => (item.tempo != null ? `${item.tempo}s` : '') },
    { label: 'Acertos', value: (item) => (item.acertos != null ? `${item.acertos}/${item.total ?? '-'}` : '') },
    { label: 'Data', value: (item) => putDateOnPattern(item.created) },
];

const ResultadosJogosListPage = () => (
    <AdminTableList title="Resultados dos jogos" description="Resultados registrados nos jogos do Tabuada Divertida." api={resultadosJogosApi} columns={columns} getKey={(item) => item.Id} getDeleteMessage={(item) => `Deseja excluir o resultado #${item.Id} de ${item.nome ?? item.jogo}?`} />
);

export default ResultadosJogosListPage;
