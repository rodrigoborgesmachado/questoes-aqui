import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

export const URL_SITE = 'https://www.questoesaqui.com';

export const ehApp = () => Capacitor.isNativePlatform();

export const urlDoSite = () => (ehApp() ? URL_SITE : window.location.origin || URL_SITE);

export const ajustarBarraDeStatus = (theme) => {
    if (!ehApp()) {
        return;
    }

    const cor = getComputedStyle(document.documentElement).getPropertyValue('--bs-body-bg').trim();
    StatusBar.setStyle({ style: theme === 'dark' ? Style.Dark : Style.Light }).catch(() => {});
    if (cor) {
        StatusBar.setBackgroundColor({ color: cor }).catch(() => {});
    }
};

export const linkExterno = (href, origem = window.location.origin) => {
    try {
        const url = new URL(href, origem);
        return /^https?:$/.test(url.protocol) && url.origin !== origem;
    } catch {
        return false;
    }
};
