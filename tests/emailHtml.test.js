import test from 'node:test';
import assert from 'node:assert/strict';
import { hiddenLinkLabel, hideEmailLinks } from '../src/utils/emailHtml.js';

test('anchors keep only their text', () => {
    assert.equal(hideEmailLinks('<p><a href="https://www.questoesaqui.com/resetpass/abc" style="color: #fff;">Recuperar senha</a></p>'), '<p>Recuperar senha</p>');
});

test('urls written as text are hidden', () => {
    const html = 'Copie este endereço:<br><a href="https://www.questoesaqui.com/validar/123">https://www.questoesaqui.com/validar/123</a>';
    assert.equal(hideEmailLinks(html), `Copie este endereço:<br>${hiddenLinkLabel}`);
    assert.equal(hideEmailLinks('Acesse www.crudforms.com/resetpass/xyz agora'), `Acesse ${hiddenLinkLabel} agora`);
});

test('empty text returns an empty string', () => {
    assert.equal(hideEmailLinks(null), '');
    assert.equal(hideEmailLinks('Olá, tudo bem?'), 'Olá, tudo bem?');
});
