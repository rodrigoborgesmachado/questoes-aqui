export const getAnexoSource = (anexo) => anexo?.link || anexo?.anexo || '';

export const buildQuestionHtml = (questao) => (
    (questao?.anexosQuestoes || []).reduce((html, anexo, index) => (
        html.replace(`<img src="#" alt="Anexo" id="divAnexo${index}"/>`, `<img src="${getAnexoSource(anexo)}" alt="Anexo" id="divAnexo${index}"/>`)
    ), questao?.campoQuestao || '')
);

export const getQuestionSummary = (html, maxLength = 220) => {
    const text = new DOMParser().parseFromString((html || '').replace(/</g, ' <'), 'text/html').body.textContent?.replace(/\s+/g, ' ').trim() || '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
