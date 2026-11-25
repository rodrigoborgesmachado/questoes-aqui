import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://www.questoesaqui.com';
const SITE_NAME = 'Questões Aqui';

const getDescriptionTag = () => document.querySelector('meta[name="description"]');

const Seo = ({ title, description }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        const defaultTitle = document.title;
        const descriptionTag = getDescriptionTag();
        const defaultDescription = descriptionTag?.getAttribute('content');
        const canonical = document.createElement('link');

        document.title = title ? `${title} | ${SITE_NAME}` : defaultTitle;
        if (descriptionTag && description) {
            descriptionTag.setAttribute('content', description);
        }
        canonical.rel = 'canonical';
        canonical.href = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;
        document.head.appendChild(canonical);

        return () => {
            document.title = defaultTitle;
            descriptionTag?.setAttribute('content', defaultDescription);
            canonical.remove();
        };
    }, [title, description, pathname]);

    return null;
};

export default Seo;
