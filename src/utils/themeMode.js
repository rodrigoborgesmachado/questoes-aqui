const THEME_STORAGE_KEY = 'crudforms-theme';

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
