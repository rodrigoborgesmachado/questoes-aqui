import api from './serviceApi';

const crudFormsInstaladorApi = {
    getPaginated: async (params) => {
        const response = await api.get('/CrudFormsInstalador/pagged', { params });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete('/CrudFormsInstalador', { params: { id } });
        return response.data;
    },
};

export default crudFormsInstaladorApi;
