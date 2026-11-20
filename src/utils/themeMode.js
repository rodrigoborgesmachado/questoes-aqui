const THEME_STORAGE_KEY = 'crudforms-theme';
const COLOR_STORAGE_KEY = 'questoesaqui-cor';
const DEFAULT_COLOR = 'padrao';

export const themeColors = [
    { id: DEFAULT_COLOR, nome: 'Padrão', icone: '🎨' },
    { id: 'por-do-sol', nome: 'Pôr do sol', icone: '🌅' },
    { id: 'doces', nome: 'Doces', icone: '🍬' },
    { id: 'galaxia', nome: 'Galáxia', icone: '🌌' },
    { id: 'jardim', nome: 'Jardim', icone: '🌷' },
    { id: 'deserto', nome: 'Deserto', icone: '🏜️' },
    { id: 'neve', nome: 'Neve', icone: '❄️' },
    { id: 'biblioteca', nome: 'Biblioteca', icone: '📚' },
    { id: 'fundo-do-mar', nome: 'Fundo do mar', icone: '🐠' },
    { id: 'vulcao', nome: 'Vulcão', icone: '🌋' },
    { id: 'arco-iris', nome: 'Arco-íris', icone: '🌈' },
    { id: 'castelo', nome: 'Castelo', icone: '🏰' },
    { id: 'selva', nome: 'Selva', icone: '🌴' },
    { id: 'cristais', nome: 'Cristais', icone: '💎' },
    { id: 'nuvens', nome: 'Nuvens', icone: '☁️' },
    { id: 'oceano', nome: 'Oceano', icone: '🌊' },
    { id: 'floresta', nome: 'Floresta', icone: '🌳' },
    { id: 'cyberpunk', nome: 'Cyberpunk', icone: '🤖' },
    { id: 'espaco-profundo', nome: 'Espaço profundo', icone: '🪐' },
];

const notifyThemeChange = () => {
    const theme = document.documentElement.getAttribute('data-bs-theme') || 'light';
    window.dispatchEvent(new CustomEvent('crudforms-theme-change', { detail: { theme } }));
};

export const getStoredTheme = () => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
};

export const applyTheme = (theme) => {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new CustomEvent('crudforms-theme-change', { detail: { theme: nextTheme } }));
    return nextTheme;
};

export const normalizeColor = (color) => (themeColors.some((item) => item.id === color) ? color : DEFAULT_COLOR);

export const getStoredColor = () => {
    if (typeof window === 'undefined') {
        return DEFAULT_COLOR;
    }

    return normalizeColor(localStorage.getItem(COLOR_STORAGE_KEY));
};

export const showColor = (color) => {
    const nextColor = normalizeColor(color);
    if (nextColor === DEFAULT_COLOR) {
        document.documentElement.removeAttribute('data-cor');
    } else {
        document.documentElement.setAttribute('data-cor', nextColor);
    }
    notifyThemeChange();
    return nextColor;
};

export const applyColor = (color) => {
    const nextColor = showColor(color);
    localStorage.setItem(COLOR_STORAGE_KEY, nextColor);
    return nextColor;
};
