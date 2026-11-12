import api from './serviceApi';

const emailApi = {
    getPaginated: async (params) => {
        const response = await api.get('/Email/pagged', { params });
        return response.data;
    },
    resendById: async (id) => {
        const response = await api.get('/Email/resendById', { params: { id } });
        return response.data;
    },
};

export default emailApi;
