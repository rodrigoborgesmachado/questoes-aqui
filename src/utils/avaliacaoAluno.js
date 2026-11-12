export const getAvaliacaoAlunoUrl = (avaliacao, chave) => `/avaliacoes/${avaliacao}${chave ? `?chave=${encodeURIComponent(chave)}` : ''}`;

export const buildRespostasAvaliacao = (selecionadas) => Object.entries(selecionadas).map(([idQuestao, idResposta]) => ({
    idQuestao: Number(idQuestao),
    idResposta,
}));

export const buildResultadoAvaliacao = (questoesAvaliacao = [], respostas = []) => {
    const itens = questoesAvaliacao.map((questaoAvaliacao) => {
        const resposta = respostas.find((item) => item.idQuestao === questaoAvaliacao.idQuestao);
        const correta = (questaoAvaliacao.questao?.respostasQuestoes || []).find((item) => item.certa === '1');
        const certa = resposta?.resposta?.certa === '1';

        return {
            questaoAvaliacao,
            idResposta: resposta?.idResposta ?? null,
            idCorreta: correta?.codigo ?? null,
            certa,
            nota: certa ? Number(questaoAvaliacao.notaQuestao) || 0 : 0,
        };
    });

    return {
        itens,
        respondidas: itens.filter((item) => item.idResposta != null).length,
        acertos: itens.filter((item) => item.certa).length,
        nota: itens.reduce((total, item) => total + item.nota, 0),
        notaTotal: questoesAvaliacao.reduce((total, item) => total + (Number(item.notaQuestao) || 0), 0),
    };
};
