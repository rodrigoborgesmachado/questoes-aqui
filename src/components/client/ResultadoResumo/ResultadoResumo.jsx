import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Share } from '@capacitor/share';
import StatCard from '../StatCard/StatCard';
import { copyToMemory } from '../../../utils/functions';
import { ehApp, urlDoSite } from '../../../services/plataforma';
import { formatDuration, getMensagem, getResumoResultado, getShareText } from '../../../utils/simuladoResultado';
import './ResultadoResumo.css';

const RING_RADIUS = 70;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export const ShareResultadoButton = ({ percentual, nomeProva, codigoProva }) => {
    const share = async () => {
        const text = getShareText(percentual, nomeProva);
        const url = codigoProva ? `${urlDoSite()}/provas/${codigoProva}` : urlDoSite();
        if (ehApp()) {
            await Share.share({ title: 'Meu resultado no Questões Aqui', text, url }).catch(() => {});
            return;
        }
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
        <button type="button" className="btn btn-outline-primary" onClick={share}>
            <i className="bi bi-share me-1" aria-hidden="true"></i>Compartilhar
        </button>
    );
};

const ResultadoResumo = ({ titulo, subtitulo, destaque, itens, puladasSemNumero = 0, totalQuestoes = 0, tempo = 0, children }) => {
    const { respondidas, acertos, erros, puladas, percentual, tempoMedio } = getResumoResultado(itens, puladasSemNumero, tempo);

    return (
        <>
            <section className="client-hero p-4 p-md-5 mb-4 shadow-sm text-center">
                <span className="text-hero-muted small">{titulo}</span>
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
                {subtitulo && <p className="text-hero-muted mb-0">{subtitulo}</p>}
                {destaque && <span className="resultado-comparacao d-inline-block small px-3 py-1 mt-3">{destaque}</span>}
            </section>

            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <StatCard icon="bi-check2-circle" label="Acertos" value={acertos} note={`de ${respondidas} respondidas`} />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard icon="bi-x-circle" label="Erros" value={erros} />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard icon="bi-skip-forward" label="Puladas" value={puladas} note={totalQuestoes > 0 ? `de ${totalQuestoes} questões` : null} />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard icon="bi-stopwatch" label="Tempo" value={formatDuration(tempo)} note={`${formatDuration(tempoMedio)} por questão`} />
                </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">{children}</div>

            {(itens.length > 0 || puladasSemNumero > 0) && (
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
                            {itens.map((item, index) => {
                                const status = item.certa == null ? 'pulada' : item.certa === '1' ? 'certa' : 'errada';
                                const label = `Questão ${item.numeroQuestao}: ${status === 'pulada' ? 'não respondida' : status}`;
                                return item.codigoQuestao ? (
                                    <Link key={`${item.codigoQuestao}-${index}`} to={`/praticar?id=${item.codigoQuestao}`} className={`resultado-mapa-item ${status}`} title={`${label}. Clique para revisar.`} aria-label={`${label}. Revisar`}>
                                        {item.numeroQuestao}
                                    </Link>
                                ) : (
                                    <span key={index} className={`resultado-mapa-item ${status}`} title={label}>{item.numeroQuestao}</span>
                                );
                            })}
                            {Array.from({ length: puladasSemNumero }, (_, index) => (
                                <span key={`pulada-${index}`} className="resultado-mapa-item pulada" title="Não respondida">
                                    <i className="bi bi-dash" aria-hidden="true"></i>
                                </span>
                            ))}
                        </div>
                        {itens.some((item) => item.codigoQuestao) && <p className="small text-body-secondary mt-3 mb-0">Clique em uma questão para revisá-la.</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default ResultadoResumo;
