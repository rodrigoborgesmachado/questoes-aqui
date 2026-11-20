import test from 'node:test';
import assert from 'node:assert/strict';
import { applyColor, getStoredColor, normalizeColor, showColor, themeColors } from '../src/utils/themeMode.js';

const storage = new Map();
const attributes = new Map([['data-bs-theme', 'dark']]);
const events = [];

globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
globalThis.document = {
    documentElement: {
        getAttribute: (name) => attributes.get(name) ?? null,
        setAttribute: (name, value) => attributes.set(name, value),
        removeAttribute: (name) => attributes.delete(name),
    },
};
globalThis.window = { dispatchEvent: (event) => events.push(event) };

test('every color theme has a unique id and the default comes first', () => {
    assert.equal(themeColors[0].id, 'padrao');
    assert.equal(new Set(themeColors.map((item) => item.id)).size, themeColors.length);
});

test('unknown colors fall back to the default theme', () => {
    assert.equal(normalizeColor('oceano'), 'oceano');
    assert.equal(normalizeColor('inexistente'), 'padrao');
    assert.equal(normalizeColor(null), 'padrao');
});

test('applying a color stores it, sets the attribute and notifies the current mode', () => {
    assert.equal(getStoredColor(), 'padrao');
    assert.equal(applyColor('galaxia'), 'galaxia');
    assert.equal(getStoredColor(), 'galaxia');
    assert.equal(attributes.get('data-cor'), 'galaxia');
    assert.equal(events.at(-1).type, 'crudforms-theme-change');
    assert.deepEqual(events.at(-1).detail, { theme: 'dark' });
});

test('showing the default color removes the attribute without changing the stored choice', () => {
    applyColor('neve');
    assert.equal(showColor('padrao'), 'padrao');
    assert.equal(attributes.has('data-cor'), false);
    assert.equal(getStoredColor(), 'neve');
});
