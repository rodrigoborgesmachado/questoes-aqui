import api from './serviceApi';

const resultadosTabuadaDivertidaApi = {
    getPaginated: async (params) => {
        const response = await api.get('/ResultadosTabuadaDivertida/pagged', { params });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete('/ResultadosTabuadaDivertida', { params: { id } });
        return response.data;
    },
};

export default resultadosTabuadaDivertidaApi;
