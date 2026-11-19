import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDuration, getItensSessao, getMensagem, getPercentual, getResumoResultado, getShareText, getSimuladoAnterior, parseRespostas, registrarResposta, registrarVisita } from '../src/utils/simuladoResultado.js';

test('answers are parsed from the saved json and invalid values become empty', () => {
    assert.deepEqual(parseRespostas('[{"certa":"1"}]'), [{ certa: '1' }]);
    assert.deepEqual(parseRespostas('invalido'), []);
    assert.deepEqual(parseRespostas(null), []);
});

test('score is the rounded share of right answers', () => {
    assert.equal(getPercentual([{ certa: '1' }, { certa: '0' }, { certa: '1' }]), 67);
    assert.equal(getPercentual([]), 0);
});

test('message changes with the score', () => {
    assert.equal(getMensagem(85), 'Mandou muito bem!');
    assert.equal(getMensagem(60), 'Bom resultado, continue assim!');
    assert.equal(getMensagem(40), 'Bom caminho, dá para melhorar!');
    assert.equal(getMensagem(10), 'Continue praticando, você chega lá!');
});

test('duration shows seconds and minutes', () => {
    assert.equal(formatDuration(42.4), '42s');
    assert.equal(formatDuration(120), '2min');
    assert.equal(formatDuration(135), '2min 15s');
    assert.equal(formatDuration(-5), '0s');
});

test('previous simulado is the latest one of the same exam before the current', () => {
    const atual = { codigo: 3, codigoProva: 1, created: '2026-11-10T10:00:00' };
    const simulados = [
        atual,
        { codigo: 1, codigoProva: 1, created: '2026-11-01T10:00:00' },
        { codigo: 2, codigoProva: 1, created: '2026-11-05T10:00:00' },
        { codigo: 4, codigoProva: 2, created: '2026-11-08T10:00:00' },
        { codigo: 5, codigoProva: 1, created: '2026-11-12T10:00:00' },
    ];
    assert.equal(getSimuladoAnterior(simulados, atual).codigo, 2);
    assert.equal(getSimuladoAnterior([atual], atual), null);
});

test('share text carries the score and the exam name', () => {
    assert.equal(getShareText(78, 'ENEM 2023'), 'Fiz 78% de aproveitamento no simulado ENEM 2023 no Questões Aqui! 🎯');
    assert.equal(getShareText(50), 'Fiz 50% de aproveitamento no simulado no Questões Aqui! 🎯');
});

test('summary counts hits, errors and skipped questions', () => {
    const itens = [{ certa: '1' }, { certa: '0' }, { certa: '1' }, { certa: null }];
    assert.deepEqual(getResumoResultado(itens, 2, 90), { respondidas: 3, acertos: 2, erros: 1, puladas: 3, percentual: 67, tempoMedio: 30 });
    assert.deepEqual(getResumoResultado([]), { respondidas: 0, acertos: 0, erros: 0, puladas: 0, percentual: 0, tempoMedio: 0 });
});

test('session keeps one entry per question in the visited order', () => {
    let sessao = registrarVisita({}, { Id: 20, numeroQuestao: 2 }, 2);
    sessao = registrarVisita(sessao, { Id: 10, numeroQuestao: 1 }, 1);
    sessao = registrarVisita(sessao, { Id: 20, numeroQuestao: 2 }, 5);
    assert.deepEqual(getItensSessao(sessao), [
        { codigoQuestao: 10, numeroQuestao: 1, certa: null, ordem: 1 },
        { codigoQuestao: 20, numeroQuestao: 2, certa: null, ordem: 2 },
    ]);
});

test('answering the same question again does not duplicate the counts', () => {
    let sessao = registrarVisita({}, { Id: 10, numeroQuestao: 1 }, 1);
    sessao = registrarResposta(sessao, 10, false);
    sessao = registrarVisita(sessao, { Id: 10, numeroQuestao: 1 }, 1);
    sessao = registrarResposta(sessao, 10, true);
    const resumo = getResumoResultado(getItensSessao(sessao));
    assert.equal(resumo.respondidas, 1);
    assert.equal(resumo.acertos, 1);
});
