import api from './serviceApi';

const postagemApi = {
    getPaginated: async (params) => {
        const response = await api.get('/Postagem/pagged', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get('/Postagem/getById', { params: { id } });
        return response.data;
    },

    create: async (itemData) => {
        const response = await api.post('/Postagem', itemData);
        return response.data;
    },

    update: async (itemData) => {
        const response = await api.put('/Postagem', itemData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete('/Postagem', { params: { id } });
        return response.data;
    },
};

export default postagemApi;
