import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../../services/redux/loadingSlice';
import simuladoApi from '../../../../services/apiServices/simuladoApi';
import StatCard from '../../../../components/client/StatCard/StatCard';
import { downloadFromLink, putDateOnPattern } from '../../../../utils/functions';

const parseRespostas = (value) => {
    try {
        return JSON.parse(value || '[]');
    } catch {
        return [];
    }
};

const SimuladoResultadoPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [simulado, setSimulado] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            dispatch(setLoading(true));
            try {
                const response = await simuladoApi.getById(id);
                if (response.success) {
                    setSimulado(response.object);
                } else {
                    toast.error('Simulado não encontrado.');
                }
            } catch {
                toast.error('Erro ao buscar o simulado.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItem();
    }, [id, dispatch]);

    const downloadReport = async () => {
        dispatch(setLoading(true));
        try {
            const response = await simuladoApi.getReportDetail(id);
            if (response.success) {
                downloadFromLink(response.object, `Simulado ${id}.html`);
            } else {
                toast.error('Relatório não encontrado.');
            }
        } catch {
            toast.error('Erro ao gerar o relatório.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (!simulado) {
        return null;
    }

    const respostas = parseRespostas(simulado.respostas);
    const certas = respostas.filter((item) => item.certa === '1').length;
    const percentual = respostas.length > 0 ? Math.round((certas / respostas.length) * 100) : 0;

    return (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
            <Link to="/simulados" className="link-secondary small d-inline-block mb-3">
                <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>Meus simulados
            </Link>
            <section className="client-hero p-4 p-md-5 mb-4 shadow-sm text-center">
                <span className="text-hero-muted small">{simulado.prova?.nomeProva}</span>
                <h1 className="display-4 fw-semibold my-2">{percentual}%</h1>
                <p className="lead text-hero-muted mb-0">de aproveitamento · {putDateOnPattern(simulado.created)}</p>
            </section>

            <div className="row g-3 mb-4">
                <div className="col-sm-4">
                    <StatCard icon="bi-list-check" label="Respondidas" value={respostas.length} />
                </div>
                <div className="col-sm-4">
                    <StatCard icon="bi-check2-circle" label="Acertos" value={certas} />
                </div>
                <div className="col-sm-4">
                    <StatCard icon="bi-stopwatch" label="Tempo" value={`${Math.max(Math.round((simulado.tempo || 0) / 60), 1)} min`} />
                </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
                <Link to={`/simulados/prova/${simulado.codigoProva}`} className="btn btn-primary">Refazer simulado</Link>
                <button type="button" className="btn btn-outline-secondary" onClick={downloadReport}>
                    <i className="bi bi-download me-1" aria-hidden="true"></i>Baixar relatório
                </button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <h2 className="h5 mb-3">Questões</h2>
                    <div className="list-group list-group-flush">
                        {respostas.map((item, index) => (
                            <div key={`${item.codigoQuestao}-${index}`} className="list-group-item bg-transparent d-flex justify-content-between align-items-center gap-2 px-0">
                                <span>Questão {item.numeroQuestao}</span>
                                <div className="d-flex align-items-center gap-2">
                                    <span className={`badge ${item.certa === '1' ? 'text-bg-success' : 'text-bg-danger'}`}>{item.certa === '1' ? 'Certa' : 'Errada'}</span>
                                    {item.codigoQuestao && <Link to={`/praticar?id=${item.codigoQuestao}`} className="btn btn-outline-secondary btn-sm">Revisar</Link>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimuladoResultadoPage;
