import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWeightedAverage, classifyMode, formatCutoff, formatScore, groupCutoffs } from '../src/pages/client/Sisu/sisuUtils.js';

test('weighted averages preserve decimal grades and fractional weights', () => {
    const result = calculateWeightedAverage([{ score: '615,5', weight: '2,5' }, { score: '700.25', weight: '1.5' }]);
    assert.equal(result.average, 647.28125);
    assert.equal(formatScore(result.average), '647,28');
});

test('equal weights yield the simple mean, including a zero grade', () => {
    const result = calculateWeightedAverage([0, 600, 700, 800, 900].map((score) => ({ score, weight: 1 })));
    assert.equal(result.average, 600);
});

test('zero-weight areas do not require a grade', () => {
    assert.equal(calculateWeightedAverage([{ score: '', weight: 0 }, { score: 800, weight: 2 }]).average, 800);
});

test('invalid calculations cannot produce NaN or an apparent valid result', () => {
    for (const rows of [[], [{ weight: 0 }], [{ weight: -1, score: 700 }], [{ weight: '', score: 700 }], [{ weight: 1, score: '' }], [{ weight: 1, score: 1001 }], [{ weight: 1, score: -1 }], [{ weight: Infinity, score: 700 }], [{ weight: 1, score: NaN }]]) {
        assert.throws(() => calculateWeightedAverage(rows));
    }
});

const offering = { codigoInstituicaoEnsino: 1, codigoCurso: 10, nomeCampus: 'Centro', nomeMunicipioCampus: 'Cidade', uFCampus: 'MG', turno: 'Integral', descricaoGrau: 'Bacharelado', numeroEdicao: '1', modoConcorrencia: 'AC', desricaoModoConcorrencia: 'Ampla concorrência' };

test('cutoff tables derive years from the records and retain zero versus missing values', () => {
    const result = groupCutoffs([{ ...offering, year: 2023, notaCorte: 0 }, { ...offering, year: 2026, notaCorte: 712.35 }, { ...offering, modoConcorrencia: 'LB', desricaoModoConcorrencia: 'Candidatos que tenham cursado integralmente o ensino médio em escolas públicas.', year: 2026, notaCorte: 650 }]);
    assert.deepEqual(result.years, [2023, 2026]);
    assert.equal(result.groups.length, 1);
    assert.equal(result.groups[0].rows.length, 2);
    assert.equal(formatScore(result.groups[0].rows[0].byYear.get(2023)[0].notaCorte), '0,00');
    assert.equal(result.groups[0].rows[1].byYear.has(2023), false);
    assert.equal(formatScore(null), '—');
    assert.equal(result.groups[0].ufCampus, 'MG');
});

test('different campuses, shifts and editions never get merged into one offering', () => {
    const base = { ...offering, year: 2025, notaCorte: 700 };
    const result = groupCutoffs([base, { ...base, nomeCampus: 'Norte' }, { ...base, turno: 'Noturno' }, { ...base, numeroEdicao: '2' }]);
    assert.equal(result.groups.length, 4);
});

test('multiple source records in one year remain visible instead of silently taking the first', () => {
    const base = { ...offering, year: 2025 };
    const result = groupCutoffs([{ ...base, id: 1, notaCorte: 700 }, { ...base, id: 2, notaCorte: 710 }]);
    assert.equal(result.groups[0].rows[0].byYear.get(2025).length, 2);
});

test('the same quota keeps one row across years even when the source renames it', () => {
    const lowIncome = 'Candidatos autodeclarados pretos, pardos ou indígenas, com renda familiar bruta per capita igual ou inferior a 1,5 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).';
    const result = groupCutoffs([
        { ...offering, nomeCampus: 'CAMPUS CENTRO', year: 2019, modoConcorrencia: 'Ampla concorrência', notaCorte: 790 },
        { ...offering, nomeCampus: 'Campus Centro', year: 2023, modoConcorrencia: 'A', notaCorte: 800 },
        { ...offering, nomeCampus: 'Campus Centro', year: 2019, modoConcorrencia: 'Lei nº 12.711/2012 - Lei de cotas', desricaoModoConcorrencia: lowIncome, notaCorte: 730 },
        { ...offering, nomeCampus: 'Campus Centro', year: 2024, modoConcorrencia: 'L', desricaoModoConcorrencia: lowIncome.replace('1,5 salário', '1 salário'), notaCorte: 720 },
    ]);
    assert.equal(result.groups.length, 1);
    assert.equal(result.groups[0].nomeCampus, 'Campus Centro');
    assert.deepEqual(result.groups[0].years, [2019, 2023, 2024]);
    assert.deepEqual(result.groups[0].rows.map((row) => row.label), ['Ampla concorrência', 'Escola pública · PPI · baixa renda']);
    assert.deepEqual([...result.groups[0].rows[1].byYear.keys()], [2019, 2024]);
    assert.equal(result.groups[0].rows[1].descriptions.length, 2);
});

test('quota labels describe the reserved group and unknown modes keep their own text', () => {
    assert.equal(classifyMode('L', 'Candidatos com deficiência, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas.').label, 'Escola pública · PcD · qualquer renda');
    assert.equal(classifyMode('L', 'Candidatos autodeclarados quilombolas, com renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas.').label, 'Escola pública · Quilombolas · baixa renda');
    assert.equal(classifyMode('V1', 'Candidatos residentes na região do campus').label, 'Candidatos residentes na região do campus');
    assert.notEqual(classifyMode('V1', 'Candidatos residentes na região do campus').key, classifyMode('V2', 'Candidatos indígenas aldeados').key);
});

test('a quota without seats shows that instead of a zero cutoff', () => {
    assert.equal(formatCutoff({ notaCorte: 0, quantidadeVagas: 0 }), 'Sem vagas');
    assert.equal(formatCutoff({ notaCorte: 0, quantidadeVagas: 2 }), '0,00');
    assert.equal(formatCutoff({ notaCorte: 712.35, quantidadeVagas: 2 }), '712,35');
});
