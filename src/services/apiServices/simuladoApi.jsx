import api from './serviceApi';

const simuladoApi = {
    getPaginated: async (params) => {
        const response = await api.get('/Simulado/pagged', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get('/Simulado/getById', { params: { id } });
        return response.data;
    },

    create: async (itemData) => {
        const response = await api.post('/Simulado', itemData);
        return response.data;
    },

    sendReportEmail: async (codigoSimulado) => {
        const response = await api.post('/Simulado/sendReportEmail', null, { params: { codigoSimulado } });
        return response.data;
    },

    getReportDetail: async (codigoSimulado) => {
        const response = await api.get('/Simulado/reportDetail', { params: { codigoSimulado } });
        return response.data;
    },
};

export default simuladoApi;
