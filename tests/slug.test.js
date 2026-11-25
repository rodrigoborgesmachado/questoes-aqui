import test from 'node:test';
import assert from 'node:assert/strict';
import { provaPath, questaoPath, slugify } from '../src/utils/slug.js';
import { buildSitemap, getStaticLocs } from '../src/utils/sitemap.js';

test('slugify remove acentos e caracteres especiais', () => {
    assert.equal(slugify('Provas IFTM — Ensino Médio 2026!'), 'provas-iftm-ensino-medio-2026');
    assert.equal(slugify(''), '');
    assert.equal(slugify(null), '');
});

test('provaPath usa id e nome da prova', () => {
    assert.equal(provaPath({ Id: 187, nomeProva: 'Vestibular UFU 2025 - 2' }), '/provas/187/vestibular-ufu-2025-2');
    assert.equal(provaPath({ Id: 187, nomeProva: '' }), '/provas/187');
});

test('questaoPath usa prova e número da questão', () => {
    assert.equal(questaoPath({ Id: 12720, numeroQuestao: 50, prova: { nomeProva: 'Simulado .NET Avançado' } }), '/questoes/12720/simulado-net-avancado-questao-50');
    assert.equal(questaoPath({ Id: 5, numeroQuestao: 0, prova: { nomeProva: 'ENEM 2024' } }), '/questoes/5/enem-2024');
    assert.equal(questaoPath({ Id: 5, numeroQuestao: 0 }), '/questoes/5');
});

test('buildSitemap junta páginas fixas, provas e questões', () => {
    const staticLocs = getStaticLocs('<urlset>\r\n  <url><loc>https://www.questoesaqui.com/</loc></url>\r\n  <url><loc>https://www.questoesaqui.com/provas</loc></url>\r\n</urlset>');
    const xml = buildSitemap(
        staticLocs,
        [{ Id: 187, nomeProva: 'Vestibular UFU 2025 - 2', updatedOn: '2026-11-17T17:53:28.17' }],
        [{ Id: 12720, numeroQuestao: 50, updatedOn: null, prova: { nomeProva: 'Simulado .NET' } }]
    );

    assert.deepEqual(staticLocs, ['https://www.questoesaqui.com/', 'https://www.questoesaqui.com/provas']);
    assert.equal(getStaticLocs(xml).length, 4);
    assert.match(xml, /<url><loc>https:\/\/www\.questoesaqui\.com\/provas\/187\/vestibular-ufu-2025-2<\/loc><lastmod>2026-11-17<\/lastmod><\/url>/);
    assert.match(xml, /<url><loc>https:\/\/www\.questoesaqui\.com\/questoes\/12720\/simulado-net-questao-50<\/loc><\/url>/);
});
