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
        // A course may have distinct campuses, shifts and editions. Keep those offerings separate.
        const key = JSON.stringify([
            record.codigoInstituicaoEnsino, record.codigoCurso, record.nomeCampus,
            record.nomeMunicipioCampus, uf, record.turno, record.descricaoGrau, record.numeroEdicao,
        ]);
        if (!groups.has(key)) {
            groups.set(key, { key, ...record, ufCampus: uf, rows: new Map() });
        }
        const group = groups.get(key);
        const description = record.desricaoModoConcorrencia || record.descricaoModoConcorrencia || '';
        const modeKey = JSON.stringify([record.modoConcorrencia, description]);
        if (!group.rows.has(modeKey)) {
            group.rows.set(modeKey, { key: modeKey, mode: record.modoConcorrencia || '', description, byYear: new Map() });
        }
        const row = group.rows.get(modeKey);
        if (!row.byYear.has(year)) {
            row.byYear.set(year, []);
        }
        row.byYear.get(year).push(record);
    }
    return {
        years: [...years].sort((a, b) => a - b),
        groups: [...groups.values()].map((group) => ({ ...group, rows: [...group.rows.values()] })),
    };
};
