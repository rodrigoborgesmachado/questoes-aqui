import api from './serviceApi';

const questoesApi = {
    getPaginated: async (params) => {
        const response = await api.get('/Questoes/pagged', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get('/Questoes/getById', { params: { id } });
        return response.data;
    },

    create: async (itemData) => {
        const response = await api.post('/Questoes', itemData);
        return response.data;
    },

    update: async (itemData) => {
        const response = await api.put('/Questoes', itemData);
        return response.data;
    },
};

export default questoesApi;
