import api from './serviceApi';

const timeout = 30000;

const sisuApi = {
    getInstituicoes: async () => {
        const response = await api.get('/NotasCorteSisu/getInstituicoes', { timeout });
        return response.data;
    },
    getCursos: async (codigoInstituicao) => {
        const response = await api.get('/NotasCorteSisu/getCursosFromInstituicao', { params: { codigoInstituicao }, timeout });
        return response.data;
    },
    getNotas: async (params) => {
        const response = await api.get('/NotasCorteSisu/getNotasFromCursoEInstituicao', { params, timeout });
        return response.data;
    },
    getCursosComPesos: async () => {
        const response = await api.get('/Pesos/getCursos', { timeout });
        return response.data;
    },
    getPesos: async (curso) => {
        const response = await api.get('/Pesos/getByCurso', { params: { curso }, timeout });
        return response.data;
    },
};

export default sisuApi;
