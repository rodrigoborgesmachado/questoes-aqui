import api from './serviceApi';

const respostasavaliacoesApi = {
    getPaginated: async (params) => {
        const response = await api.get('/RespostasAvaliacoes/paggedAdmin', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get('/RespostasAvaliacoes/getById', { params: { id } });
        return response.data;
    },

    getAvaliacaoAluno: async (avaliacao, chave) => {
        const response = await api.get('/RespostasAvaliacoes/avaliacaoAluno', { params: { avaliacao, chave } });
        return response.data;
    },

    getMinhasRespostas: async (avaliacao) => {
        const response = await api.get('/RespostasAvaliacoes/getByAvaliacao', { params: { avaliacao } });
        return response.data;
    },

    finalizar: async (avaliacao, chave, respostas) => {
        const response = await api.post('/RespostasAvaliacoes/finalizar', respostas, { params: { avaliacao, chave } });
        return response.data;
    },
};

export default respostasavaliacoesApi;
