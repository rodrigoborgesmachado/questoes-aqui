import { useEffect, useState } from 'react';
import meuDesempenhoApi from '../../../services/apiServices/meuDesempenhoApi';
import respostasusuariosApi from '../../../services/apiServices/respostasusuariosApi';
import simuladoApi from '../../../services/apiServices/simuladoApi';

const requests = {
    analysis: () => meuDesempenhoApi.getAnalysis(),
    history: () => respostasusuariosApi.getHistory({ page: 1, quantity: 3 }),
    simulations: () => simuladoApi.getPaginated({ page: 1, quantity: 2 }),
};

const initialResources = () => Object.fromEntries(
    Object.keys(requests).map((key) => [key, { status: 'loading', data: null }]),
);

const useHomeData = (isAuthenticated) => {
    const [resources, setResources] = useState(initialResources);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        let active = true;
        const load = async (key, request) => {
            try {
                const response = await request();
                const data = response.object;
                const validData = key === 'analysis'
                    ? data && typeof data === 'object' && !Array.isArray(data)
                    : Array.isArray(data);

                if (response.success === false || !validData) {
                    throw new Error('Dados indisponíveis');
                }

                if (active) {
                    setResources((previous) => ({ ...previous, [key]: { status: 'ready', data } }));
                }
            } catch {
                if (active) {
                    setResources((previous) => ({ ...previous, [key]: { status: 'error', data: null } }));
                }
            }
        };

        // Each section becomes available independently, without blocking the home page.
        Object.entries(requests).forEach(([key, request]) => { load(key, request); });

        return () => { active = false; };
    }, [isAuthenticated, attempt]);

    const retry = () => {
        setResources(initialResources());
        setAttempt((previous) => previous + 1);
    };

    return { ...resources, retry };
};

export default useHomeData;
