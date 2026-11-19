import api from './serviceApi';

const materialApoioProvaApi = {
    getByProva: async (codigoProva) => {
        const response = await api.get('/MaterialApoioProva/getByProva', { params: { codigoProva } });
        return response.data;
    },

    create: async (itemData) => {
        const response = await api.post('/MaterialApoioProva', itemData);
        return response.data;
    },

    update: async (itemData) => {
        const response = await api.put('/MaterialApoioProva', itemData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete('/MaterialApoioProva', { params: { id } });
        return response.data;
    },
};

export default materialApoioProvaApi;
