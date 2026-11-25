import { provaPath, questaoPath } from './slug.js';

export const SITE_URL = 'https://www.questoesaqui.com';

const escapeXml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const getLastmod = (value) => (value ? String(value).slice(0, 10) : '');

export const getStaticLocs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

export const buildSitemap = (staticLocs, provas = [], questoes = []) => {
    const urls = [
        ...staticLocs.map((loc) => ({ loc })),
        ...provas.map((prova) => ({ loc: `${SITE_URL}${provaPath(prova)}`, lastmod: getLastmod(prova.updatedOn) })),
        ...questoes.map((questao) => ({ loc: `${SITE_URL}${questaoPath(questao)}`, lastmod: getLastmod(questao.updatedOn) })),
    ];
    const lines = urls.map(({ loc, lastmod }) => `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`);
    return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...lines, '</urlset>', ''].join('\n');
};
