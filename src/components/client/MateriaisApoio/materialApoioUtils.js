export const MAX_MATERIAL_TITLE = 255;

export const hasMateriaisApoio = (prova) => (prova?.quantidadeMateriaisApoio || 0) > 0;

export const isValidUrl = (value = '') => {
    try {
        const url = new URL(value.trim());
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

export const validateMaterial = ({ title = '', url = '' } = {}) => {
    const value = title.trim();
    if (!value) return 'Informe o título do material.';
    if (value.length > MAX_MATERIAL_TITLE) return `O título deve ter no máximo ${MAX_MATERIAL_TITLE} caracteres.`;
    if (!isValidUrl(url)) return 'Informe uma URL válida (http ou https).';
    return null;
};
