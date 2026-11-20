import test from 'node:test';
import assert from 'node:assert/strict';
import { activeLabel, canUpdateActive, isActive } from '../src/components/admin/UsuarioAtivo/usuarioAtivoUtils.js';
import { getLoginErrorMessage } from '../src/pages/common/LoginPage/loginUtils.js';

test('user is active unless the flag is "0"', () => {
    assert.equal(isActive({ isActive: '1' }), true);
    assert.equal(isActive({ isActive: '0' }), false);
    assert.equal(isActive({ isActive: 0 }), false);
    assert.equal(isActive({}), true);
});

test('admin cannot change the active flag of the own user', () => {
    assert.equal(canUpdateActive({ Id: 10 }, 10), false);
    assert.equal(canUpdateActive({ Id: 10 }, '10'), false);
    assert.equal(canUpdateActive({ Id: 11 }, 10), true);
});

test('action label follows the current flag', () => {
    assert.equal(activeLabel({ isActive: '1' }), 'Desativar usuário');
    assert.equal(activeLabel({ isActive: '0' }), 'Ativar usuário');
});

test('login shows a specific message for deactivated users', () => {
    assert.match(getLoginErrorMessage({ response: { status: 403 } }), /desativado/);
    assert.match(getLoginErrorMessage({ response: { status: 401 } }), /Falha na autenticação/);
    assert.match(getLoginErrorMessage(), /Falha na autenticação/);
});
