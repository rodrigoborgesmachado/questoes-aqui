export const MAIS_PATHS = ['/mais', '/sobre', '/privacidade', '/termos', '/contato', '/ranking'];

const inicio = { path: '/', label: 'Início', icon: 'bi-house', isActive: (path) => path === '/' };
const provas = { path: '/provas', label: 'Provas', icon: 'bi-journal-text', isActive: (path) => path === '/provas' || path.startsWith('/provas/') };
const questoes = { path: '/questoes', label: 'Questões', icon: 'bi-list-check', isActive: (path) => path === '/questoes' || path.startsWith('/questoes/') || path === '/praticar' };
const simulados = { path: '/simulados', label: 'Simulados', icon: 'bi-stopwatch', isActive: (path) => path === '/simulados' || path.startsWith('/simulados/') };
const sisu = { path: '/sisu/notas-de-corte', label: 'Sisu', icon: 'bi-mortarboard', isActive: (path) => path.startsWith('/sisu/') };
const mais = { path: '/mais', label: 'Mais', icon: 'bi-three-dots', isActive: (path) => MAIS_PATHS.includes(path) };

export const getBottomNavItems = (isAuthenticated) => [inicio, provas, questoes, isAuthenticated ? simulados : sisu, mais];

export const isFocusPath = (path) => path.startsWith('/simulados/prova/') || /^\/avaliacoes\/[^/]+$/.test(path);

export const getMaisGroups = (isAuthenticated) => [
    {
        title: 'Provas por tipo',
        links: ['ENEM', 'IFTM', 'UFU'].map((tipo) => ({ path: `/provas?tipos=${tipo}`, label: tipo, icon: 'bi-journal-bookmark' })),
    },
    {
        title: 'Sisu',
        links: [
            ...(isAuthenticated ? [{ path: '/sisu/notas-de-corte', label: 'Notas de corte', icon: 'bi-mortarboard' }] : []),
            { path: '/sisu/calculadora-enem', label: 'Calculadora ENEM', icon: 'bi-calculator' },
        ],
    },
    {
        title: 'Sua conta',
        links: isAuthenticated
            ? [{ path: '/ranking', label: 'Ranking', icon: 'bi-trophy' }]
            : [{ path: '/entrar', label: 'Entrar', icon: 'bi-box-arrow-in-right' }, { path: '/criar-conta', label: 'Criar conta', icon: 'bi-person-plus' }],
    },
    {
        title: 'A plataforma',
        links: [
            { path: '/sobre', label: 'Sobre', icon: 'bi-info-circle' },
            { path: '/privacidade', label: 'Privacidade', icon: 'bi-shield-lock' },
            { path: '/termos', label: 'Termos', icon: 'bi-file-text' },
            { path: '/contato', label: 'Contato', icon: 'bi-envelope' },
            { href: 'https://www.tabuadadivertida.com/?utm_source=questoesaqui&utm_medium=app', label: 'Tabuada Divertida', icon: 'bi-box-arrow-up-right' },
        ],
    },
];
