import test from 'node:test';
import assert from 'node:assert/strict';
import { findActiveGroupKey, isItemActive, menuGroups } from '../src/components/admin/AdminSidebar/adminMenu.js';

test('menu groups list the four projects', () => {
    assert.deepEqual(menuGroups.map((group) => group.label), ['Questões Aqui', 'Tabuada Divertida', 'CrudForms', 'Data Spark']);
});

test('dashboard is active only on the root path', () => {
    const dashboard = { path: '' };
    assert.equal(isItemActive(dashboard, '/'), true);
    assert.equal(isItemActive(dashboard, '/provas'), false);
});

test('items stay active on nested paths without matching similar prefixes', () => {
    assert.equal(isItemActive({ path: 'provas' }, '/provas/10/questoes'), true);
    assert.equal(isItemActive({ path: 'questoes' }, '/questoes-extra'), false);
    assert.equal(isItemActive({ path: 'data-spark/pessoas' }, '/data-spark/pessoas/'), true);
});

test('active group follows the current path', () => {
    assert.equal(findActiveGroupKey('/'), 'questoes-aqui');
    assert.equal(findActiveGroupKey('/historico-tabuada-divertida'), 'tabuada-divertida');
    assert.equal(findActiveGroupKey('/tabuada-divertida/resultados-jogos'), 'tabuada-divertida');
    assert.equal(findActiveGroupKey('/crud-forms/instaladores'), 'crud-forms');
    assert.equal(findActiveGroupKey('/data-spark/veiculos'), 'data-spark');
    assert.equal(findActiveGroupKey('/inexistente'), undefined);
});
