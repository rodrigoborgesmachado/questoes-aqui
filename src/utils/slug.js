export const slugify = (text) => String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const withSlug = (path, text) => {
    const slug = slugify(text);
    return slug ? `${path}/${slug}` : path;
};

export const provaPath = (prova) => withSlug(`/provas/${prova.Id}`, prova.nomeProva);

export const questaoPath = (questao) => withSlug(
    `/questoes/${questao.Id}`,
    [questao.prova?.nomeProva, questao.numeroQuestao > 0 && `questao ${questao.numeroQuestao}`].filter(Boolean).join(' ')
);
