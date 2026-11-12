import api from './serviceApi';

const reportesQuestoesApi = {
    add: async (data) => {
        const response = await api.post('/ReportesQuestoes', data);
        return response.data;
    },

    getAgrupados: async (params) => {
        const response = await api.get('/ReportesQuestoes/agrupados', { params });
        return response.data;
    },

    updateStatus: async (data) => {
        const response = await api.put('/ReportesQuestoes/status', data);
        return response.data;
    },
};

export default reportesQuestoesApi;
