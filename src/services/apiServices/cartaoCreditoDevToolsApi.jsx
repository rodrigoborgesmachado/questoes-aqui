import api from './serviceApi';

const cartaoCreditoDevToolsApi = {
    getPaginated: async (params) => {
        const response = await api.get('/CartaoCreditoDevTools/pagged', { params });
        return response.data;
    },

    delete: async (cartao) => {
        const response = await api.delete('/CartaoCreditoDevTools', { params: { cartao } });
        return response.data;
    },
};

export default cartaoCreditoDevToolsApi;
