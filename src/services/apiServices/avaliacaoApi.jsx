import api from './serviceApi';

const avaliacaoApi = {
    getPaginated: async (params) => {
        const response = await api.get('/Avaliacao/paggedAdmin', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get('/Avaliacao/getById', { params: { id } });
        return response.data;
    },

    updateStatus: async (id, active) => {
        const response = await api.put('/Avaliacao/updateStatus', null, { params: { id, active } });
        return response.data;
    },
};

export default avaliacaoApi;
