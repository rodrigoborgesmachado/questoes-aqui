import api from './serviceApi';

const tipoProvaApi = {
    getPaginated: async (params) => {
        const response = await api.get('/TipoProva/pagged', { params });
        return response.data;
    },

    create: async (itemData) => {
        const response = await api.post('/TipoProva', itemData);
        return response.data;
    },
};

export default tipoProvaApi;
