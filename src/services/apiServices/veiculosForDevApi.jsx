import api from './serviceApi';

const veiculosForDevApi = {
    getPaginated: async (params) => {
        const response = await api.get('/VeiculosForDev/pagged', { params });
        return response.data;
    },

    delete: async (renavam) => {
        const response = await api.delete('/VeiculosForDev', { params: { renavam } });
        return response.data;
    },
};

export default veiculosForDevApi;
