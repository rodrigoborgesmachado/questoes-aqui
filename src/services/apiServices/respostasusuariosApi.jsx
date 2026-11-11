import api from './serviceApi';

const respostasusuariosApi = {
    getPaginated: async (params) => {
        const response = await api.get('/respostasusuaro/pagged', { params: { ...params, idUser: -1 } });
        return response.data;
    },

    getHistory: async (params) => {
        const response = await api.get('/RespostasUsuaro/getHistory', { params });
        return response.data;
    },

    getReportDetail: async (codigoUsuario) => {
        const response = await api.get('/RespostasQuestoes/reportDetail', { params: { codigoUsuario } });
        return response.data;
    },

    getRanking: async () => {
        const response = await api.get('/RespostasUsuaro/ranking');
        return response.data;
    },
};

export default respostasusuariosApi;
