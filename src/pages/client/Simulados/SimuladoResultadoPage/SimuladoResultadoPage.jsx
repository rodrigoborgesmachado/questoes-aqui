import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../../services/redux/loadingSlice';
import simuladoApi from '../../../../services/apiServices/simuladoApi';
import questoesApi from '../../../../services/apiServices/questoesApi';
import StatCard from '../../../../components/client/StatCard/StatCard';
import { copyToMemory, downloadFromLink, putDateOnPattern } from '../../../../utils/functions';
import { formatDuration, getMensagem, getPercentual, getShareText, getSimuladoAnterior, parseRespostas } from '../../../../utils/simuladoResultado';
import './SimuladoResultadoPage.css';

const RING_RADIUS = 70;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const SimuladoResultadoPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [simulado, setSimulado] = useState(null);
    const [totalQuestoes, setTotalQuestoes] = useState(0);
    const [anterior, setAnterior] = useState(null);

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

    useEffect(() => {
        if (!simulado) {
            return;
        }
        questoesApi.getPaginated({ page: 1, quantity: 1, codigoProva: simulado.codigoProva })
            .then((response) => setTotalQuestoes(response.success ? response.total || 0 : 0))
            .catch(() => {});
        simuladoApi.getPaginated({ page: 1, quantity: 50 })
            .then((response) => setAnterior(getSimuladoAnterior(response.object || [], simulado)))
            .catch(() => {});
    }, [simulado]);

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
    const erradas = respostas.length - certas;
    const puladas = Math.max(totalQuestoes - respostas.length, 0);
    const percentual = getPercentual(respostas);
    const tempo = simulado.tempo || 0;
    const tempoMedio = respostas.length > 0 ? tempo / respostas.length : 0;
    const diferenca = anterior ? percentual - getPercentual(parseRespostas(anterior.respostas)) : null;

    const share = async () => {
        const text = getShareText(percentual, simulado.prova?.nomeProva);
        const url = `${window.location.origin}/provas/${simulado.codigoProva}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Meu resultado no Questões Aqui', text, url });
            } catch (error) {
                if (error?.name !== 'AbortError') {
                    toast.error('Não foi possível compartilhar.');
                }
            }
            return;
        }
        if (await copyToMemory(`${text} ${url}`)) {
            toast.success('Resultado copiado! Agora é só colar onde quiser.');
        } else {
            toast.error('Não foi possível copiar o resultado.');
        }
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
            <Link to="/simulados" className="link-secondary small d-inline-block mb-3">
                <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>Meus simulados
            </Link>
            <section className="client-hero p-4 p-md-5 mb-4 shadow-sm text-center">
                <span className="text-hero-muted small">{simulado.prova?.nomeProva}</span>
                <div className="resultado-ring mx-auto my-3">
                    <svg width="168" height="168" viewBox="0 0 168 168" aria-hidden="true">
                        <circle className="resultado-ring-track" cx="84" cy="84" r={RING_RADIUS} fill="none" strokeWidth="12" />
                        <circle className="resultado-ring-value" cx="84" cy="84" r={RING_RADIUS} fill="none" strokeWidth="12" strokeLinecap="round" strokeDasharray={RING_LENGTH} strokeDashoffset={RING_LENGTH * (1 - percentual / 100)} />
                    </svg>
                    <div className="resultado-ring-label">
                        <h1 className="display-5 fw-semibold mb-0">{percentual}%</h1>
                        <span className="small text-hero-muted">aproveitamento</span>
                    </div>
                </div>
                <p className="lead fw-semibold mb-1">{getMensagem(percentual)}</p>
                <p className="text-hero-muted mb-0">{putDateOnPattern(simulado.created)}</p>
                {diferenca !== null && (
                    <span className="resultado-comparacao d-inline-block small px-3 py-1 mt-3">
                        <i className={`bi ${diferenca > 0 ? 'bi-arrow-up' : diferenca < 0 ? 'bi-arrow-down' : 'bi-dash'} me-1`} aria-hidden="true"></i>
                        {diferenca === 0 ? 'Mesmo resultado da última vez' : `${diferenca > 0 ? '+' : ''}${diferenca}% em relação à última vez`}
                    </span>
                )}
            </section>

            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <StatCard icon="bi-check2-circle" label="Acertos" value={certas} note={`de ${respostas.length} respondidas`} />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard icon="bi-x-circle" label="Erros" value={erradas} />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard icon="bi-skip-forward" label="Puladas" value={puladas} note={totalQuestoes > 0 ? `de ${totalQuestoes} questões` : null} />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard icon="bi-stopwatch" label="Tempo" value={formatDuration(tempo)} note={`${formatDuration(tempoMedio)} por questão`} />
                </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
                <Link to={`/simulados/prova/${simulado.codigoProva}`} className="btn btn-primary">Refazer simulado</Link>
                <button type="button" className="btn btn-outline-primary" onClick={share}>
                    <i className="bi bi-share me-1" aria-hidden="true"></i>Compartilhar
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={downloadReport}>
                    <i className="bi bi-download me-1" aria-hidden="true"></i>Baixar relatório
                </button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                        <h2 className="h5 mb-0">Mapa de questões</h2>
                        <div className="d-flex flex-wrap gap-3 small text-body-secondary">
                            <span><span className="resultado-legenda resultado-mapa-item certa me-1"></span>Certa</span>
                            <span><span className="resultado-legenda resultado-mapa-item errada me-1"></span>Errada</span>
                            {puladas > 0 && <span><span className="resultado-legenda resultado-mapa-item pulada me-1"></span>Não respondida</span>}
                        </div>
                    </div>
                    <div className="resultado-mapa">
                        {respostas.map((item, index) => {
                            const certa = item.certa === '1';
                            const label = `Questão ${item.numeroQuestao}: ${certa ? 'certa' : 'errada'}`;
                            return item.codigoQuestao ? (
                                <Link key={`${item.codigoQuestao}-${index}`} to={`/praticar?id=${item.codigoQuestao}`} className={`resultado-mapa-item ${certa ? 'certa' : 'errada'}`} title={`${label}. Clique para revisar.`} aria-label={`${label}. Revisar`}>
                                    {item.numeroQuestao}
                                </Link>
                            ) : (
                                <span key={index} className={`resultado-mapa-item ${certa ? 'certa' : 'errada'}`} title={label}>{item.numeroQuestao}</span>
                            );
                        })}
                        {Array.from({ length: puladas }, (_, index) => (
                            <span key={`pulada-${index}`} className="resultado-mapa-item pulada" title="Não respondida">
                                <i className="bi bi-dash" aria-hidden="true"></i>
                            </span>
                        ))}
                    </div>
                    {respostas.length > 0 && <p className="small text-body-secondary mt-3 mb-0">Clique em uma questão para revisá-la.</p>}
                </div>
            </div>
        </div>
    );
};

export default SimuladoResultadoPage;
