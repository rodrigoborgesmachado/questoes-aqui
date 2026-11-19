import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDuration, getMensagem, getPercentual, getShareText, getSimuladoAnterior, parseRespostas } from '../src/utils/simuladoResultado.js';

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
