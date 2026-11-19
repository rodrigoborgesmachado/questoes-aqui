export const parseRespostas = (value) => {
    try {
        return JSON.parse(value || '[]');
    } catch {
        return [];
    }
};

export const getPercentual = (respostas = []) => {
    const certas = respostas.filter((item) => item.certa === '1').length;
    return respostas.length > 0 ? Math.round((certas / respostas.length) * 100) : 0;
};

export const getMensagem = (percentual) => {
    if (percentual >= 80) return 'Mandou muito bem!';
    if (percentual >= 60) return 'Bom resultado, continue assim!';
    if (percentual >= 40) return 'Bom caminho, dá para melhorar!';
    return 'Continue praticando, você chega lá!';
};

export const formatDuration = (seconds) => {
    const total = Math.max(Math.round(seconds), 0);
    if (total < 60) return `${total}s`;
    const minutes = Math.floor(total / 60);
    const rest = total % 60;
    return rest > 0 ? `${minutes}min ${rest}s` : `${minutes}min`;
};

export const getSimuladoAnterior = (simulados = [], atual) => simulados
    .filter((item) => item.codigoProva === atual.codigoProva && item.codigo !== atual.codigo && new Date(item.created) < new Date(atual.created))
    .sort((a, b) => new Date(b.created) - new Date(a.created))[0] || null;

export const getShareText = (percentual, nomeProva) => `Fiz ${percentual}% de aproveitamento no simulado${nomeProva ? ` ${nomeProva}` : ''} no Questões Aqui! 🎯`;
