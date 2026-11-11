import api from './serviceApi';

const publicQuestoesApi = {
    getProvasPaginated: async (params) => {
        const response = await api.get('/PublicQuestoes/provas-pagged', { params });
        return response.data;
    },

    getProvaById: async (id) => {
        const response = await api.get('/PublicQuestoes/prova-by-id', { params: { id } });
        return response.data;
    },

    getQuestoesPaginated: async (params) => {
        const response = await api.get('/PublicQuestoes/questoes-pagged', { params });
        return response.data;
    },

    getQuestaoById: async (id) => {
        const response = await api.get('/PublicQuestoes/questao-by-id', { params: { id } });
        return response.data;
    },
};

export default publicQuestoesApi;
