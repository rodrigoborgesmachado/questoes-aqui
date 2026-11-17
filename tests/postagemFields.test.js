import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPostagemPayload, createEmptyPostagem, getTipoPostagemLabel, toPostagemForm } from '../src/pages/admin/Postagens/postagemFields.js';

test('post types follow the API enum', () => {
    assert.equal(getTipoPostagemLabel(0), 'Projetos em destaque');
    assert.equal(getTipoPostagemLabel('1'), 'Artigos');
    assert.equal(getTipoPostagemLabel(2), 'Psico');
});

test('form keeps only editable fields and fills missing values', () => {
    const form = toPostagemForm({ id: 10, titulo: 'Título', descricao: '<p>Texto</p>', link: null, curtidas: 5 });
    assert.deepEqual(form, { ...createEmptyPostagem(), titulo: 'Título', descricao: '<p>Texto</p>' });
});

test('new post payload converts type, clears empty link and starts without likes', () => {
    const payload = buildPostagemPayload({ ...createEmptyPostagem(), tipoPostagem: '1', link: '  ' });
    assert.equal(payload.tipoPostagem, 1);
    assert.equal(payload.link, null);
    assert.equal(payload.curtidas, 0);
});

test('edited post payload keeps the original data not shown in the form', () => {
    const original = { id: 1000, created: '2024-01-01T00:00:00', isActive: '1', curtidas: 7, titulo: 'Antigo' };
    const payload = buildPostagemPayload({ ...toPostagemForm(original), titulo: 'Novo', descricao: '<b>HTML</b>' }, original);
    assert.equal(payload.id, 1000);
    assert.equal(payload.created, original.created);
    assert.equal(payload.isActive, '1');
    assert.equal(payload.curtidas, 7);
    assert.equal(payload.titulo, 'Novo');
    assert.equal(payload.descricao, '<b>HTML</b>');
});
