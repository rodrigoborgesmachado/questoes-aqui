import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import adminApi from '../../../services/apiServices/adminApi';
import { BarList, StackedBarList } from '../../../components/admin/Charts/BarList';

const numberFormatter = new Intl.NumberFormat('pt-BR');

const periodos = [
    { dias: 7, label: '7 dias' },
    { dias: 30, label: '30 dias' },
    { dias: 90, label: '90 dias' },
    { dias: 365, label: '1 ano' },
    { dias: 0, label: 'Tudo' },
];

const agrupamentos = [
    { key: 'prova', title: 'Respostas por prova', description: 'Volume e aproveitamento agrupados por prova.' },
    { key: 'avaliacao', title: 'Respostas por avaliação', description: 'Comparação entre acertos e erros em avaliações.' },
    { key: 'materia', title: 'Respostas por matéria', description: 'Matérias com maior participação e desempenho.' },
    { key: 'banca', title: 'Respostas por banca', description: 'Distribuição de respostas por banca.' },
    { key: 'tipo', title: 'Respostas por tipo', description: 'Desempenho por tipo de prova.' },
];

const safeList = (list) => (Array.isArray(list) ? list : []);
const formatNumber = (value) => numberFormatter.format(Number(value || 0));
const formatPercent = (value, total) => (total ? `${Math.round((value / total) * 100)}%` : '0%');
const toStackedItems = (list) => safeList(list).map((item) => ({ label: item.descricao, primary: Number(item.certas || 0), secondary: Number(item.erradas || 0) }));
const toBarItems = (list) => safeList(list).map((item) => ({ label: item.descricao, value: Number(item.valor || 0) }));

const Loading = () => (
    <p className="text-body-secondary mb-0" role="status"><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Carregando...</p>
);

const ReportSection = ({ title, description, items }) => {
    const total = safeList(items).reduce((soma, item) => soma + item.primary + item.secondary, 0);
    const correct = safeList(items).reduce((soma, item) => soma + item.primary, 0);

    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
                <h2 className="h5 mb-1">{title}</h2>
                <p className="text-body-secondary small">{description}</p>
                {!items ? <Loading /> : items.length > 0 ? (
                    <>
                        <p className="small mb-3">
                            <strong>{formatNumber(total)}</strong> respostas registradas · <strong>{formatPercent(correct, total)}</strong> de aproveitamento
                        </p>
                        <StackedBarList items={items} />
                    </>
                ) : (
                    <p className="text-body-secondary mb-0">Sem dados para este período.</p>
                )}
            </div>
        </div>
    );
};

const SimpleSection = ({ title, description, items }) => (
    <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
            <h2 className="h5 mb-1">{title}</h2>
            <p className="text-body-secondary small">{description}</p>
            {!items ? <Loading /> : items.length > 0 ? <BarList items={items} /> : <p className="text-body-secondary mb-0">Sem dados.</p>}
        </div>
    </div>
);

const RelatoriosPage = () => {
    const [dias, setDias] = useState(30);
    const [respostas, setRespostas] = useState({});
    const [questoesPorUsuarios, setQuestoesPorUsuarios] = useState(null);
    const [questoesValidadasPorUsuarios, setQuestoesValidadasPorUsuarios] = useState(null);

    useEffect(() => {
        let ativo = true;

        agrupamentos.forEach(({ key }) => {
            adminApi.getRespostasPor(key, { dias })
                .then((response) => ativo && setRespostas((atual) => ({ ...atual, [key]: toStackedItems(response.object) })))
                .catch(() => {
                    if (!ativo) return;
                    setRespostas((atual) => ({ ...atual, [key]: [] }));
                    toast.error('Erro ao buscar os dados');
                });
        });

        return () => {
            ativo = false;
        };
    }, [dias]);

    useEffect(() => {
        adminApi.getQuestoesCadastradasPorUsuarios()
            .then((response) => setQuestoesPorUsuarios(toBarItems(response.object)))
            .catch(() => setQuestoesPorUsuarios([]));
        adminApi.getQuestoesValidadasPorUsuarios()
            .then((response) => setQuestoesValidadasPorUsuarios(toBarItems(response.object)))
            .catch(() => setQuestoesValidadasPorUsuarios([]));
    }, []);

    const alterarPeriodo = (novoPeriodo) => {
        if (novoPeriodo === dias) return;
        setRespostas({});
        setDias(novoPeriodo);
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Relatórios</h1>
                    <p className="text-body-secondary mb-0">Respostas agrupadas por prova, avaliação, matéria, banca e tipo no período escolhido.</p>
                </div>
                <div className="btn-group btn-group-sm flex-wrap" role="group" aria-label="Período">
                    {periodos.map((periodo) => (
                        <button key={periodo.dias} type="button" className={`btn ${dias === periodo.dias ? 'btn-primary' : 'btn-outline-secondary'}`}
                            aria-pressed={dias === periodo.dias} onClick={() => alterarPeriodo(periodo.dias)}>
                            {periodo.label}
                        </button>
                    ))}
                </div>
            </div>

            {agrupamentos.map((agrupamento) => (
                <ReportSection key={agrupamento.key} title={agrupamento.title} description={agrupamento.description} items={respostas[agrupamento.key]} />
            ))}

            <div className="row g-3">
                <div className="col-lg-6">
                    <SimpleSection title="Questões cadastradas por usuário" description="Quem mais contribuiu com cadastro de questões (todo o período)." items={questoesPorUsuarios} />
                </div>
                <div className="col-lg-6">
                    <SimpleSection title="Questões validadas por usuário" description="Quem mais atuou na validação de questões (todo o período)." items={questoesValidadasPorUsuarios} />
                </div>
            </div>
        </div>
    );
};

export default RelatoriosPage;
