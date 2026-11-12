import api from './serviceApi';

const empresaForDevApi = {
    getPaginated: async (params) => {
        const response = await api.get('/EmpresaForDev/pagged', { params });
        return response.data;
    },

    delete: async (cnpj) => {
        const response = await api.delete('/EmpresaForDev', { params: { cnpj } });
        return response.data;
    },
};

export default empresaForDevApi;
