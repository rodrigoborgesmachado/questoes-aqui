import test from 'node:test';
import assert from 'node:assert/strict';
import { getBottomNavItems, getMaisGroups, isFocusPath } from '../src/components/client/ClientBottomNav/bottomNavItems.js';

const activeLabels = (path, isAuthenticated = true) => getBottomNavItems(isAuthenticated).filter((item) => item.isActive(path)).map((item) => item.label);

test('the bottom bar shows simulados for logged users and sisu for visitors', () => {
    assert.deepEqual(getBottomNavItems(true).map((item) => item.path), ['/', '/provas', '/questoes', '/simulados', '/mais']);
    assert.deepEqual(getBottomNavItems(false).map((item) => item.path), ['/', '/provas', '/questoes', '/sisu/notas-de-corte', '/mais']);
});

test('exactly one tab is active for each section', () => {
    for (const [path, label] of [['/', 'Início'], ['/provas', 'Provas'], ['/provas/12', 'Provas'], ['/questoes', 'Questões'], ['/questoes/5', 'Questões'], ['/praticar', 'Questões'], ['/simulados', 'Simulados'], ['/simulados/resultado/3', 'Simulados'], ['/mais', 'Mais'], ['/sobre', 'Mais'], ['/ranking', 'Mais']]) {
        assert.deepEqual(activeLabels(path), [label], path);
    }
    assert.deepEqual(activeLabels('/sisu/calculadora-enem', false), ['Sisu']);
    assert.deepEqual(activeLabels('/provasx'), []);
    assert.deepEqual(activeLabels('/perfil'), []);
});

test('the bar is hidden while answering a simulado or an avaliação', () => {
    assert.equal(isFocusPath('/simulados/prova/10'), true);
    assert.equal(isFocusPath('/avaliacoes/abc'), true);
    assert.equal(isFocusPath('/avaliacoes/abc/resultado'), false);
    assert.equal(isFocusPath('/simulados'), false);
});

test('the mais page keeps the links that left the top menu and the footer', () => {
    const paths = (isAuthenticated) => getMaisGroups(isAuthenticated).flatMap((group) => group.links.map((link) => link.path ?? link.href));
    const logged = paths(true);
    for (const path of ['/provas?tipos=ENEM', '/provas?tipos=IFTM', '/provas?tipos=UFU', '/sisu/notas-de-corte', '/sisu/calculadora-enem', '/ranking', '/sobre', '/privacidade', '/termos', '/contato']) {
        assert.ok(logged.includes(path), path);
    }
    assert.ok(logged.some((path) => path.startsWith('https://www.tabuadadivertida.com/')));
    const visitor = paths(false);
    assert.ok(visitor.includes('/criar-conta') && visitor.includes('/entrar'));
    assert.ok(!visitor.includes('/ranking') && !visitor.includes('/sisu/notas-de-corte'));
});
