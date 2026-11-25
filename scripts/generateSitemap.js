import { readFile, writeFile } from 'node:fs/promises';
import { buildSitemap, getStaticLocs } from '../src/utils/sitemap.js';

const API_URL = 'https://apisunsale.azurewebsites.net/api/PublicQuestoes';
const QUANTITY = 1000;

const fetchAll = async (endpoint, params = '') => {
    const items = [];
    for (let page = 1; ; page++) {
        const response = await fetch(`${API_URL}/${endpoint}?page=${page}&quantity=${QUANTITY}${params}`);
        if (!response.ok) {
            throw new Error(`${endpoint} retornou ${response.status}`);
        }
        const data = await response.json();
        const pageItems = data.object || [];
        items.push(...pageItems);
        if (!pageItems.length || items.length >= (data.total || 0)) {
            return items;
        }
    }
};

try {
    const staticLocs = getStaticLocs(await readFile('public/sitemap.xml', 'utf8'));
    const provas = await fetchAll('provas-pagged');
    const questoes = await fetchAll('questoes-pagged', '&anexos=false');
    await writeFile('dist/sitemap.xml', buildSitemap(staticLocs, provas, questoes));
    console.log(`sitemap.xml gerado com ${staticLocs.length + provas.length + questoes.length} URLs.`);
} catch (error) {
    console.warn(`Não foi possível gerar o sitemap dinâmico, mantendo o fixo: ${error.message}`);
}
