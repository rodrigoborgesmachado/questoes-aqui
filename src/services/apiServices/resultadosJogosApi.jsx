import api from './serviceApi';

const resultadosJogosApi = {
    getPaginated: async (params) => {
        const response = await api.get('/ResultadosJogos/pagged', { params });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete('/ResultadosJogos', { params: { id } });
        return response.data;
    },
};

export default resultadosJogosApi;
