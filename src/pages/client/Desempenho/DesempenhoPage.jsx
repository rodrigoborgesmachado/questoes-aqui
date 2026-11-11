import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoading } from '../../../services/redux/loadingSlice';
import meuDesempenhoApi from '../../../services/apiServices/meuDesempenhoApi';
import StatCard from '../../../components/client/StatCard/StatCard';
import { StackedBarList } from '../../../components/admin/Charts/BarList';

const toStackedItems = (list) => (list || []).map((item) => ({ label: item.descricao, primary: Number(item.certas || 0), secondary: Number(item.erradas || 0) }));

const sections = [
    { key: 'respostasPorMateria', title: 'Por matéria' },
    { key: 'respostasPorProvas', title: 'Por prova' },
    { key: 'respostasPorBanca', title: 'Por banca' },
    { key: 'respostasPorTipo', title: 'Por tipo de prova' },
];

const DesempenhoPage = () => {
    const dispatch = useDispatch();
    const [dados, setDados] = useState(null);

    useEffect(() => {
        const fetchDados = async () => {
            dispatch(setLoading(true));
            try {
                const response = await meuDesempenhoApi.getAnalysis();
                setDados(response.object || {});
            } catch {
                toast.error('Erro ao buscar o desempenho.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchDados();
    }, [dispatch]);

    if (!dados) {
        return null;
    }

    const tentadas = dados.quantidadeQuestoesTentadas || 0;
    const corretas = dados.quantidadeQuestoesResolvidasCorretas || 0;

    return (
        <>
            <div className="mb-4">
                <h1 className="h3 mb-1">Meu desempenho</h1>
                <p className="text-body-secondary mb-0">Veja onde você está indo bem e o que merece mais atenção.</p>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-sm-6 col-xl-3">
                    <StatCard icon="bi-pencil-square" label="Questões tentadas" value={tentadas} />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <StatCard icon="bi-check2-circle" label="Corretas" value={corretas} />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <StatCard icon="bi-x-circle" label="Incorretas" value={dados.quantidadeQuestoesIncorretas || 0} />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <StatCard icon="bi-percent" label="Aproveitamento" value={`${tentadas > 0 ? Math.round((corretas / tentadas) * 100) : 0}%`} />
                </div>
            </div>

            <div className="row g-3">
                {sections.map((section) => {
                    const items = toStackedItems(dados[section.key]);
                    return (
                        <div key={section.key} className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <h2 className="h5 mb-3">{section.title}</h2>
                                    {items.length > 0 ? <StackedBarList items={items} /> : <p className="text-body-secondary mb-0">Sem respostas registradas ainda.</p>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default DesempenhoPage;
