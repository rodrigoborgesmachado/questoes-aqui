export const tiposPostagem = [
    { value: 0, label: 'Projetos em destaque' },
    { value: 1, label: 'Artigos' },
    { value: 2, label: 'Psico' },
];

export const getTipoPostagemLabel = (value) => tiposPostagem.find((tipo) => tipo.value === Number(value))?.label ?? value;

export const createEmptyPostagem = () => ({
    titulo: '',
    tituloEn: '',
    intro: '',
    introEn: '',
    descricao: '',
    descricaoEn: '',
    tipoPostagem: 0,
    capa: '',
    link: '',
});

export const toPostagemForm = (item = {}) => {
    const emptyForm = createEmptyPostagem();
    return Object.keys(emptyForm).reduce((form, field) => ({ ...form, [field]: item[field] ?? emptyForm[field] }), {});
};

export const isPostagemAtiva = (item = {}) => `${item.isActive}` === '1';

export const buildStatusPayload = (item) => ({ ...item, isActive: isPostagemAtiva(item) ? '0' : '1' });

export const buildPostagemPayload =(formData, original = {}) => ({
    ...original,
    ...formData,
    tipoPostagem: Number(formData.tipoPostagem),
    link: formData.link?.trim() || null,
    curtidas: original.curtidas ?? 0,
});
