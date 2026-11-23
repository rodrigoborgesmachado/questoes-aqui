import api from './serviceApi';

const adminApi = {
    getAnalysis: async () => {
        const response = await api.get('/Admin/analysis');
        return response.data;
    },

    getQuestoesCadastradasPorUsuarios: async () => {
        const response = await api.get('/Admin/getquantidadequestoescadastradasporusuarios');
        return response.data;
    },

    getQuestoesValidadasPorUsuarios: async () => {
        const response = await api.get('/Admin/getquantidadequestoesvalidadasporusuarios');
        return response.data;
    },

    getRespostasPor: async (agrupamento, params) => {
        const response = await api.get(`/Admin/getquantidaderespostaspor${agrupamento}`, { params });
        return response.data;
    },

    getQuestoesParaRevisao: async (params) => {
        const response = await api.get('/Admin/questoespararevisao', { params });
        return response.data;
    },

    getProvasParaRevisao: async (params) => {
        const response = await api.get('/Admin/provaspararevisao', { params });
        return response.data;
    },
};

export default adminApi;
