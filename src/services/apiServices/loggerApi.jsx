import api from './serviceApi';

const loggerApi = {
    getPaginated: async (params) => {
        const response = await api.get('/Logger/pagged', { params });
        return response.data;
    },
};

export default loggerApi;
