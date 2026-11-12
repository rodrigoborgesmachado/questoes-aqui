import api from './serviceApi';

const usuariosCrudFormsApi = {
    getPaginated: async (params) => {
        const response = await api.get('/UsuariosCrudForms/pagged', { params });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete('/UsuariosCrudForms', { params: { id } });
        return response.data;
    },
};

export default usuariosCrudFormsApi;
