export const menuGroups = [
    {
        key: 'questoes-aqui',
        label: 'Questões Aqui',
        icon: 'bi-mortarboard',
        items: [
            { path: '', label: 'Dashboard', icon: 'bi-speedometer2' },
            { path: 'provas', label: 'Provas', icon: 'bi-book' },
            { path: 'questoes', label: 'Questões', icon: 'bi-folder' },
            { path: 'avaliacoes', label: 'Avaliações', icon: 'bi-clipboard-check' },
            { path: 'respostas-avaliacoes', label: 'Respostas das Avaliações', icon: 'bi-ui-checks' },
            { path: 'notas-de-corte', label: 'Notas de corte do Sisu', icon: 'bi-graph-up' },
            { path: 'usuarios', label: 'Usuários', icon: 'bi-person' },
            { path: 'historico-usuarios', label: 'Histórico de usuários', icon: 'bi-person-lines-fill' },
            { path: 'historico-respostas', label: 'Histórico de respostas', icon: 'bi-clock-history' },
            { path: 'logs', label: 'Logs', icon: 'bi-journal-text' },
        ],
    },
    {
        key: 'tabuada-divertida',
        label: 'Tabuada Divertida',
        icon: 'bi-calculator',
        items: [
            { path: 'historico-tabuada-divertida', label: 'Histórico Tabuada Divertida', icon: 'bi-calculator' },
            { path: 'tabuada-divertida/resultados-jogos', label: 'Resultados dos jogos', icon: 'bi-controller' },
        ],
    },
    {
        key: 'crud-forms',
        label: 'CrudForms',
        icon: 'bi-window-stack',
        items: [
            { path: 'crud-forms/usuarios', label: 'Usuários', icon: 'bi-people' },
            { path: 'crud-forms/instaladores', label: 'Instaladores', icon: 'bi-download' },
        ],
    },
    {
        key: 'data-spark',
        label: 'Data Spark',
        icon: 'bi-lightning-charge',
        items: [
            { path: 'data-spark/pessoas', label: 'Pessoas', icon: 'bi-person-vcard' },
            { path: 'data-spark/empresas', label: 'Empresas', icon: 'bi-building' },
            { path: 'data-spark/cartoes-credito', label: 'Cartões de crédito', icon: 'bi-credit-card' },
            { path: 'data-spark/veiculos', label: 'Veículos', icon: 'bi-car-front' },
        ],
    },
];

export const isItemActive = (item, pathname) => {
    const path = pathname.split('/').filter(Boolean).join('/');
    return item.path === '' ? path === '' : path === item.path || path.startsWith(`${item.path}/`);
};

export const findActiveGroupKey = (pathname) => menuGroups.find((group) => group.items.some((item) => isItemActive(item, pathname)))?.key;
