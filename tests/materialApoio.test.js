import test from 'node:test';
import assert from 'node:assert/strict';
import { hasMateriaisApoio, isValidUrl, MAX_MATERIAL_TITLE, validateMaterial } from '../src/components/client/MateriaisApoio/materialApoioUtils.js';

test('support material option is shown only when the exam has materials', () => {
    assert.equal(hasMateriaisApoio({ quantidadeMateriaisApoio: 2 }), true);
    assert.equal(hasMateriaisApoio({ quantidadeMateriaisApoio: 0 }), false);
    assert.equal(hasMateriaisApoio({}), false);
    assert.equal(hasMateriaisApoio(), false);
});

test('only http and https urls are accepted', () => {
    assert.equal(isValidUrl('https://www.exemplo.com/material.pdf'), true);
    assert.equal(isValidUrl(' http://exemplo.com '), true);
    assert.equal(isValidUrl('javascript:alert(1)'), false);
    assert.equal(isValidUrl('ftp://exemplo.com'), false);
    assert.equal(isValidUrl('exemplo.com'), false);
    assert.equal(isValidUrl(), false);
});

test('material requires title and valid url', () => {
    assert.ok(validateMaterial());
    assert.ok(validateMaterial({ title: '   ', url: 'https://exemplo.com' }));
    assert.ok(validateMaterial({ title: 'Resumo', url: 'exemplo' }));
    assert.ok(validateMaterial({ title: 'a'.repeat(MAX_MATERIAL_TITLE + 1), url: 'https://exemplo.com' }));
    assert.equal(validateMaterial({ title: 'Resumo de matemática', url: 'https://exemplo.com/resumo' }), null);
});
