import api from './serviceApi';

const meuDesempenhoApi = {
    getAnalysis: async () => {
        const response = await api.get('/meudesempenho/analysis');
        return response.data;
    },
};

export default meuDesempenhoApi;
