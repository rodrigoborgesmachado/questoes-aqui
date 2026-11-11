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
};

export default respostasavaliacoesApi;
