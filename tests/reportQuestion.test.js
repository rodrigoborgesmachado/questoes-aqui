import test from 'node:test';
import assert from 'node:assert/strict';
import { countMotivos, getMotivoLabel, getOpenCodes, getStatus, MAX_REPORT_DESCRIPTION, validateReport } from '../src/components/client/ReportQuestion/reportUtils.js';

test('report requires a known reason', () => {
    assert.ok(validateReport());
    assert.ok(validateReport({ motivo: 'inexistente' }));
    assert.equal(validateReport({ motivo: 'gabarito' }), null);
    assert.equal(validateReport({ motivo: 'imagem', descricao: 'Imagem da alternativa C não carrega' }), null);
});

test('reason "outro" requires a description', () => {
    assert.ok(validateReport({ motivo: 'outro', descricao: '   ' }));
    assert.equal(validateReport({ motivo: 'outro', descricao: 'Alternativas repetidas' }), null);
});

test('oversized descriptions are rejected', () => {
    assert.ok(validateReport({ motivo: 'enunciado', descricao: 'a'.repeat(MAX_REPORT_DESCRIPTION + 1) }));
    assert.equal(validateReport({ motivo: 'enunciado', descricao: ` ${'a'.repeat(MAX_REPORT_DESCRIPTION)} ` }), null);
});

test('reasons are counted per question and labels are resolved', () => {
    const reportes = [{ motivo: 'gabarito' }, { motivo: 'imagem' }, { motivo: 'gabarito' }];
    assert.deepEqual(countMotivos(reportes).map(({ value, quantidade }) => ({ value, quantidade })), [{ value: 'gabarito', quantidade: 2 }, { value: 'imagem', quantidade: 1 }]);
    assert.deepEqual(countMotivos(), []);
    assert.equal(getMotivoLabel('anulada'), 'Questão anulada');
    assert.equal(getMotivoLabel('novo'), 'novo');
    assert.equal(getStatus('resolvido').label, 'Resolvido');
});

test('only open reports can be resolved or discarded', () => {
    const reportes = [{ codigo: 1, status: 'aberto' }, { codigo: 2, status: 'resolvido' }, { codigo: 3, status: 'aberto' }, { codigo: 4, status: 'descartado' }];
    assert.deepEqual(getOpenCodes(reportes), [1, 3]);
    assert.deepEqual(getOpenCodes(), []);
});
