export const enemAreas = [
    'Redação',
    'Ciências da Natureza e suas Tecnologias',
    'Ciências Humanas e suas Tecnologias',
    'Linguagens, Códigos e suas Tecnologias',
    'Matemática e suas Tecnologias',
];

export const parseDecimal = (value) => {
    if (value === null || value === undefined || String(value).trim() === '') {
        return null;
    }
    const number = Number(String(value).trim().replace(',', '.'));
    return Number.isFinite(number) ? number : null;
};

export const calculateWeightedAverage = (rows) => {
    if (!rows.length) {
        throw new Error('Informe as notas e os pesos para calcular a média.');
    }
    let totalWeight = 0;
    let weightedSum = 0;
    for (const row of rows) {
        const weight = parseDecimal(row.weight);
        if (weight === null || weight < 0) {
            throw new Error('Preencha todos os pesos com valores iguais ou maiores que zero.');
        }
        if (weight === 0) {
            continue;
        }
        const score = parseDecimal(row.score);
        if (score === null || score < 0 || score > 1000) {
            throw new Error('Informe uma nota entre 0 e 1.000 para cada área com peso maior que zero.');
        }
        totalWeight += weight;
        weightedSum += score * weight;
    }
    if (totalWeight <= 0 || !Number.isFinite(totalWeight) || !Number.isFinite(weightedSum)) {
        throw new Error('A soma dos pesos deve ser maior que zero e conter valores válidos.');
    }
    return { average: weightedSum / totalWeight, totalWeight, weightedSum };
};

export const scoreFormatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatScore = (value) => {
    const number = parseDecimal(value);
    return number === null ? '—' : scoreFormatter.format(number);
};

export const formatCutoff = (record) => {
    const number = parseDecimal(record.notaCorte);
    return number === 0 && parseDecimal(record.quantidadeVagas) === 0 ? 'Sem vagas' : formatScore(number);
};

const normalizeText = (value) => String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

export const classifyMode = (mode, description) => {
    const normalizedMode = normalizeText(mode);
    const text = normalizeText(description);
    if (normalizedMode === 'a' || normalizedMode.includes('ampla') || text.includes('ampla concorrencia')) {
        return { key: 'ampla', label: 'Ampla concorrência', order: 0 };
    }
    if (text.includes('escola') && text.includes('public')) {
        const parts = ['Escola pública'];
        if (text.includes('pretos') || text.includes('pardos')) {
            parts.push('PPI');
        } else if (text.includes('indigenas')) {
            parts.push('Indígenas');
        }
        if (text.includes('quilombola')) {
            parts.push('Quilombolas');
        }
        if (text.includes('deficiencia')) {
            parts.push('PcD');
        }
        if (text.includes('independentemente da renda')) {
            parts.push('qualquer renda');
        } else if (text.includes('renda')) {
            parts.push('baixa renda');
        }
        const label = parts.join(' · ');
        return { key: label, label, order: 1 };
    }
    const label = String(description || mode || 'Modalidade').trim();
    return { key: `${normalizedMode}|${normalizeText(description)}`, label, order: 2 };
};

export const groupCutoffs = (records) => {
    const groups = new Map();
    const years = new Set();
    for (const record of records) {
        const year = Number(record.year);
        if (!Number.isInteger(year) || year <= 0) {
            continue;
        }
        years.add(year);
        const uf = record.ufCampus ?? record.uFCampus ?? record.UFCampus ?? '';
        const key = JSON.stringify([
            record.codigoInstituicaoEnsino, record.codigoCurso, normalizeText(record.nomeCampus),
            normalizeText(record.nomeMunicipioCampus), normalizeText(uf), normalizeText(record.turno),
            normalizeText(record.descricaoGrau), record.numeroEdicao,
        ]);
        if (!groups.has(key)) {
            groups.set(key, { key, latestYear: 0, years: new Set(), rows: new Map() });
        }
        const group = groups.get(key);
        group.years.add(year);
        if (year > group.latestYear) {
            Object.assign(group, record, { key, latestYear: year, years: group.years, rows: group.rows, ufCampus: uf });
        }
        const description = (record.desricaoModoConcorrencia || record.descricaoModoConcorrencia || '').trim();
        const mode = classifyMode(record.modoConcorrencia, description);
        if (!group.rows.has(mode.key)) {
            group.rows.set(mode.key, { ...mode, descriptions: new Set(), byYear: new Map() });
        }
        const row = group.rows.get(mode.key);
        if (description && description !== row.label) {
            row.descriptions.add(description);
        }
        if (!row.byYear.has(year)) {
            row.byYear.set(year, []);
        }
        row.byYear.get(year).push(record);
    }
    return {
        years: [...years].sort((a, b) => a - b),
        groups: [...groups.values()].map((group) => ({
            ...group,
            years: [...group.years].sort((a, b) => a - b),
            rows: [...group.rows.values()]
                .map((row) => ({ ...row, descriptions: [...row.descriptions] }))
                .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'pt-BR')),
        })),
    };
};
