export const MAX_COMMENT_LENGTH = 2000;

export const toCommentText = (comentario = '') => comentario.replace(/<br\s*\/?>/gi, '\n');

export const validateComment = (texto = '') => {
    const value = texto.trim();
    if (!value) return 'Escreva um comentário antes de enviar.';
    if (value.length > MAX_COMMENT_LENGTH) return `O comentário deve ter no máximo ${MAX_COMMENT_LENGTH} caracteres.`;
    return null;
};

export const appendComments = (current, incoming) => {
    const codes = new Set(current.map((item) => item.codigo));
    return [...current, ...incoming.filter((item) => !codes.has(item.codigo))];
};
