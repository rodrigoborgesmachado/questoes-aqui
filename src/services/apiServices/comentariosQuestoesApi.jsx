import api from './serviceApi';

const comentariosQuestoesApi = {
    getByQuestao: async (params) => {
        const response = await api.get('/ComentariosQuestoes/getByQuestao', { params });
        return response.data;
    },

    add: async (data) => {
        const response = await api.post('/ComentariosQuestoes', data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete('/ComentariosQuestoes', { params: { id } });
        return response.data;
    },
};

export default comentariosQuestoesApi;
