import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRespostasAvaliacao, buildResultadoAvaliacao, getAvaliacaoAlunoUrl } from '../src/utils/avaliacaoAluno.js';

const questoesAvaliacao = [
    { idQuestao: 10, notaQuestao: 2, questao: { respostasQuestoes: [{ codigo: 101, certa: '0' }, { codigo: 102, certa: '1' }] } },
    { idQuestao: 20, notaQuestao: 3, questao: { respostasQuestoes: [{ codigo: 201, certa: '1' }, { codigo: 202, certa: '0' }] } },
    { idQuestao: 30, notaQuestao: 5, questao: { respostasQuestoes: [{ codigo: 301, certa: '' }] } },
];

test('student link carries the key only for private evaluations', () => {
    assert.equal(getAvaliacaoAlunoUrl(7), '/avaliacoes/7');
    assert.equal(getAvaliacaoAlunoUrl(7, 'a b'), '/avaliacoes/7?chave=a%20b');
});

test('selected answers become the payload sent to the api', () => {
    assert.deepEqual(buildRespostasAvaliacao({ 10: 102, 20: 202 }), [{ idQuestao: 10, idResposta: 102 }, { idQuestao: 20, idResposta: 202 }]);
});

test('result counts hits, answered questions and the score', () => {
    const respostas = [
        { idQuestao: 10, idResposta: 102, resposta: { certa: '1' } },
        { idQuestao: 20, idResposta: 202, resposta: { certa: '0' } },
    ];
    const resultado = buildResultadoAvaliacao(questoesAvaliacao, respostas);

    assert.equal(resultado.respondidas, 2);
    assert.equal(resultado.acertos, 1);
    assert.equal(resultado.nota, 2);
    assert.equal(resultado.notaTotal, 10);
    assert.deepEqual(resultado.itens.map((item) => item.idCorreta), [102, 201, null]);
    assert.equal(resultado.itens[2].idResposta, null);
});
