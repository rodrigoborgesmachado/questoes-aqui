import { ehApp } from './plataforma';

const GA_ID = 'G-VJ3SZXHCQD';
const ROTAS_IGNORADAS = ['/resetpass/', '/valida/'];

const ativo = () => import.meta.env.PROD && !ehApp();

export const iniciarAnalytics = () => {
    if (!ativo()) {
        return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: false });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
};

export const registrarEvento = (nome, parametros = {}) => {
    if (ativo()) {
        window.gtag?.('event', nome, parametros);
    }
};

export const registrarPagina = (caminho) => {
    if (ROTAS_IGNORADAS.some((rota) => caminho.startsWith(rota))) {
        return;
    }

    registrarEvento('page_view', {
        page_path: caminho,
        page_location: `${window.location.origin}${caminho}`,
        page_title: document.title,
    });
};
