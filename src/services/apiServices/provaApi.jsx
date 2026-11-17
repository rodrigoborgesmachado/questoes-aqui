import api from './serviceApi';

const provaApi = {
    getPaginated: async (params) => {
        const response = await api.get('/Prova/pagged', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get('/Prova/getById', { params: { id } });
        return response.data;
    },

    create: async (itemData) => {
        const response = await api.post('/Prova', itemData);
        return response.data;
    },

    update: async (itemData) => {
        const response = await api.put('/Prova', itemData);
        return response.data;
    },

    updateStatus: async (id, active) => {
        const response = await api.put('/Prova/updateStatus', null, { params: { id, active } });
        return response.data;
    },

    downloadProva: async (codigo) => {
        const response = await api.get('/Prova/downloadProva', { params: { codigo } });
        return response.data;
    },

    downloadGabarito: async (codigo) => {
        const response = await api.get('/Prova/downloadGabarito', { params: { codigo } });
        return response.data;
    },

    getAllBancas: async (params) => {
        const response = await api.get('/Prova/GetAllBancas', { params });
        return response.data;
    },

    getAllTipos: async (params) => {
        const response = await api.get('/Prova/GetAllTipos', { params });
        return response.data;
    },

    getAllProvasName: async (params) => {
        const response = await api.get('/Prova/GetAllProvasName', { params });
        return response.data;
    },

    getAllMaterias: async () => {
        const response = await api.get('/Prova/GetAllMaterias');
        return response.data;
    },
};

export default provaApi;
