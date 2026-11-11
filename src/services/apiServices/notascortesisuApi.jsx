import api from './serviceApi';

const notascortesisuApi = {
    getPaginated: async (params) => {
        const response = await api.get('/NotasCorteSisu/paggedAdmin', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get('/NotasCorteSisu/getById', { params: { id } });
        return response.data;
    },

    create: async (itemData) => {
        const response = await api.post('/NotasCorteSisu', itemData);
        return response.data;
    },

    update: async (itemData) => {
        const response = await api.put('/NotasCorteSisu', itemData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete('/NotasCorteSisu', { params: { id } });
        return response.data;
    },
};

export default notascortesisuApi;
