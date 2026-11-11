import api from './serviceApi';

const respostasQuestoesApi = {
    validaResposta: async (id) => {
        const response = await api.get('/RespostasQuestoes/validaResposta', { params: { id } });
        return response.data;
    },

    getRespostaCorreta: async (questao) => {
        const response = await api.get('/RespostasQuestoes/getRespostaCorreta', { params: { questao } });
        return response.data;
    },
};

export default respostasQuestoesApi;
