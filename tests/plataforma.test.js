import test from 'node:test';
import assert from 'node:assert/strict';
import { ehApp, linkExterno } from '../src/services/plataforma.js';

test('links to other sites are external and internal or non-web links are not', () => {
    const origem = 'https://localhost';
    assert.equal(linkExterno('https://www.tabuadadivertida.com/', origem), true);
    assert.equal(linkExterno('http://www.sunsalesystem.com.br/', origem), true);
    assert.equal(linkExterno('https://localhost/provas', origem), false);
    assert.equal(linkExterno('/provas', origem), false);
    assert.equal(linkExterno('mailto:contato@questoesaqui.com', origem), false);
    assert.equal(linkExterno('http://[invalido', origem), false);
});

test('outside the native shell it is not the app', () => {
    assert.equal(ehApp(), false);
});
