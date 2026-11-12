import api from './serviceApi';

const pessoasForDevApi = {
    getPaginated: async (params) => {
        const response = await api.get('/PessoasForDev/pagged', { params });
        return response.data;
    },

    delete: async (cpf) => {
        const response = await api.delete('/PessoasForDev', { params: { cpf } });
        return response.data;
    },
};

export default pessoasForDevApi;
