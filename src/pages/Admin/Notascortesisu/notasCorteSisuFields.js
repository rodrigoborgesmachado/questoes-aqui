export const notasCorteSisuFields = [
    { name: 'year', label: 'Ano', type: 'number' },
    { name: 'numeroEdicao', label: 'Edição' },
    { name: 'codigoInstituicaoEnsino', label: 'Código da instituição', type: 'number' },
    { name: 'nomeInstituicao', label: 'Nome da instituição' },
    { name: 'siglaInstituicao', label: 'Sigla da instituição' },
    { name: 'organizacaoAcademica', label: 'Organização acadêmica' },
    { name: 'categoriaOrganizacao', label: 'Categoria da organização' },
    { name: 'nomeCampus', label: 'Campus' },
    { name: 'nomeMunicipioCampus', label: 'Cidade' },
    { name: 'ufCampus', label: 'UF' },
    { name: 'regiaoCampus', label: 'Região' },
    { name: 'codigoCurso', label: 'Código do curso', type: 'number' },
    { name: 'nomeCurso', label: 'Nome do curso' },
    { name: 'descricaoGrau', label: 'Grau' },
    { name: 'turno', label: 'Turno' },
    { name: 'modoConcorrencia', label: 'Concorrência' },
    { name: 'desricaoModoConcorrencia', label: 'Descrição da concorrência' },
    { name: 'bonusAcaoAfirmativa', label: 'Bônus de ação afirmativa', type: 'number', step: '0.01' },
    { name: 'quantidadeVagas', label: 'Vagas', type: 'number' },
    { name: 'notaCorte', label: 'Nota de corte', type: 'number', step: '0.01' },
    { name: 'quantidadeInscricoes', label: 'Inscrições', type: 'number' },
];

export const normalizeNotaCorteSisu = (item = {}) => ({
    ...item,
    ufCampus: item.ufCampus ?? item.uFCampus ?? item.UFCampus,
});
