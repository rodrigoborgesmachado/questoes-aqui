import api from './serviceApi';

const usuariosApi = {
    getAll: async () => {
        const response = await api.get('/Usuarios');
        return response.data;
    },

    getPaginated: async (params) => {
        const response = await api.get('/Usuarios/pagged', { params });
        return response.data;
    },

    resendConfirmationEmail: async (mail) => {
        const response = await api.get('/Usuarios/reenviaEmailConfirmacao', { params: { mail } });
        return response.data;
    },

    create: async (itemData, perfil) => {
        const response = await api.post('/Usuarios', itemData, { params: { perfil } });
        return response.data;
    },

    liberaUser: async (guid) => {
        const response = await api.get('/Usuarios/liberauser', { params: { guid } });
        return response.data;
    },

    getPerfil: async () => {
        const response = await api.get('/Usuarios/getPerfil');
        return response.data;
    },

    updateName: async (name) => {
        const response = await api.put('/Usuarios/updateName', {}, { params: { name } });
        return response.data;
    },

    updateInstituicao: async (instituicao) => {
        const response = await api.put('/Usuarios/updateInstituicao', {}, { params: { instituicao } });
        return response.data;
    },

    updateSenha: async (oldPass, newPass) => {
        const response = await api.put('/Usuarios/updateSenha', {}, { params: { oldPass, newPass } });
        return response.data;
    },
};

export default usuariosApi;
