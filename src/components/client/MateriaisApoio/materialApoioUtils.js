export const MAX_MATERIAL_TITLE = 255;

export const MAX_MATERIAL_FILE_SIZE = 10 * 1024 * 1024;

export const MATERIAL_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];

export const validateMaterialFile = (file) => {
    if (!file) return 'Selecione um arquivo.';
    if (!MATERIAL_FILE_TYPES.includes(file.type)) return 'Tipo de arquivo não suportado. Envie PDF, JPG, PNG ou GIF.';
    if (file.size > MAX_MATERIAL_FILE_SIZE) return 'O arquivo deve ter no máximo 10 MB.';
    return null;
};

export const hasMateriaisApoio = (prova) => (prova?.quantidadeMateriaisApoio || 0) > 0;

export const isValidUrl = (value = '') => {
    try {
        const url = new URL(value.trim());
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

export const validateMaterial = ({ title = '', url = '', arquivo = null } = {}) => {
    const value = title.trim();
    if (!value) return 'Informe o título do material.';
    if (value.length > MAX_MATERIAL_TITLE) return `O título deve ter no máximo ${MAX_MATERIAL_TITLE} caracteres.`;
    if (arquivo) return validateMaterialFile(arquivo);
    if (!isValidUrl(url)) return 'Informe uma URL válida (http ou https) ou envie um arquivo.';
    return null;
};
