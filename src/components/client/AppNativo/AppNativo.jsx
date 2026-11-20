import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { SplashScreen } from '@capacitor/splash-screen';
import { ajustarBarraDeStatus, ehApp, linkExterno } from '../../../services/plataforma';
import { getStoredTheme } from '../../../utils/themeMode';

const AppNativo = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const rota = useRef(pathname);

    useEffect(() => {
        rota.current = pathname;
    }, [pathname]);

    useEffect(() => {
        if (!ehApp()) {
            return;
        }

        SplashScreen.hide().catch(() => {});
        ajustarBarraDeStatus(getStoredTheme());

        const voltar = App.addListener('backButton', ({ canGoBack }) => {
            if (rota.current === '/') {
                App.exitApp();
            } else if (canGoBack) {
                navigate(-1);
            } else {
                navigate('/', { replace: true });
            }
        });

        const abrirLink = (event) => {
            const link = event.target?.closest?.('a');
            if (link && linkExterno(link.href)) {
                event.preventDefault();
                Browser.open({ url: link.href }).catch(() => {});
            }
        };

        const trocarTema = (event) => ajustarBarraDeStatus(event.detail.theme);

        document.addEventListener('click', abrirLink);
        window.addEventListener('crudforms-theme-change', trocarTema);
        return () => {
            voltar.then((ouvinte) => ouvinte.remove());
            document.removeEventListener('click', abrirLink);
            window.removeEventListener('crudforms-theme-change', trocarTema);
        };
    }, [navigate]);

    return null;
};

export default AppNativo;
