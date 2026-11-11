import { useEffect, useState } from 'react';

// Parameters are either a selected code or the stable query object submitted by the form.
const useSisuList = (load, parameter = true) => {
    const [result, setResult] = useState(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (parameter === null) {
            return;
        }
        const lifecycle = new AbortController();
        const fetchList = async () => {
            try {
                const response = await load(parameter);
                if (response.success === false || !Array.isArray(response.object)) {
                    throw new Error('Dados indisponíveis');
                }
                if (!lifecycle.signal.aborted) {
                    setResult({ parameter, attempt, status: 'ready', data: response.object });
                }
            } catch {
                if (!lifecycle.signal.aborted) {
                    setResult({ parameter, attempt, status: 'error', data: [] });
                }
            }
        };
        fetchList();
        return () => { lifecycle.abort(); };
    }, [load, parameter, attempt]);

    const current = parameter === null
        ? { status: 'idle', data: [] }
        : result?.parameter === parameter && result.attempt === attempt
            ? result
            : { status: 'loading', data: [] };

    return { ...current, retry: () => setAttempt((previous) => previous + 1) };
};

export default useSisuList;
