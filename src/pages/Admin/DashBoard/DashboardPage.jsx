import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../../../services/apiServices/adminApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import BaseModal from '../../../components/common/Modals/BaseModal/BaseModal';
import Pagination from '../../../components/common/Pagination/Pagination';
import ColumnChart from '../../../components/admin/Charts/ColumnChart';
import { putDateOnPatternOnlyDate } from '../../../utils/functions';
import { getReportesAbertosResumo } from '../../../components/client/ReportQuestion/reportUtils';

const quantityPerPage = 8;
const diasGrafico = 14;
const numberFormatter = new Intl.NumberFormat('pt-BR');

const safeList = (list) => (Array.isArray(list) ? list : []);
const formatNumber = (value) => numberFormatter.format(Number(value || 0));
const formatPercent = (value, total) => (total ? `${Math.round((value / total) * 100)}%` : '0%');
const getItemId = (item) => item?.id ?? item?.Id;
const toDateKey = (value) => String(value || '').slice(0, 10);
const sum = (list, field) => list.reduce((total, item) => total + Number(item[field] || 0), 0);

const buildDays = (dataReferencia) => {
    const [year, month, day] = toDateKey(dataReferencia).split('-').map(Number);
    const reference = year ? new Date(Date.UTC(year, month - 1, day)) : new Date();

    return Array.from({ length: diasGrafico }, (_, index) => {
        const date = new Date(reference);
        date.setUTCDate(date.getUTCDate() - (diasGrafico - 1 - index));
        const key = date.toISOString().slice(0, 10);
        return { key, label: `${key.slice(8, 10)}/${key.slice(5, 7)}` };
    });
};

const Trend = ({ current, previous, suffix = '%', diff }) => {
    const value = diff ?? (previous ? Math.round(((current - previous) / previous) * 100) : null);

    if (value === null) {
        return <span className="text-body-secondary small">sem base nos 7 dias anteriores</span>;
    }

    const className = value > 0 ? 'text-success' : value < 0 ? 'text-danger' : 'text-body-secondary';
    const icon = value > 0 ? 'bi-arrow-up-short' : value < 0 ? 'bi-arrow-down-short' : 'bi-dash';

    return (
        <span className={`small ${className}`}>
            <i className={`bi ${icon}`} aria-hidden="true"></i>{Math.abs(value)}{suffix} vs 7 dias anteriores
        </span>
    );
};

const KpiCard = ({ label, value, trend, note }) => (
    <div className="col-sm-6 col-xl-3">
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <span className="text-body-secondary small">{label}</span>
                <strong className="d-block fs-3">{value}</strong>
                {trend}
                {note && <span className="d-block text-body-secondary small">{note}</span>}
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, description, children }) => (
    <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
            <h2 className="h5 mb-1">{title}</h2>
            <p className="text-body-secondary small">{description}</p>
            {children}
        </div>
    </div>
);

const QueueItem = ({ icon, label, value, action }) => (
    <li className="list-group-item d-flex justify-content-between align-items-center gap-2 px-0">
        <span><i className={`bi ${icon} me-2 text-body-secondary`} aria-hidden="true"></i>{label}</span>
        <span className="d-flex align-items-center gap-2">
            <strong>{formatNumber(value)}</strong>
            {action}
        </span>
    </li>
);

const DashboardPage = () => {
    const dispatch = useDispatch();
    const [dados, setDados] = useState({});
    const [questoes, setQuestoes] = useState([]);
    const [provas, setProvas] = useState([]);
    const [pageQuestoes, setPageQuestoes] = useState(1);
    const [pageProvas, setPageProvas] = useState(1);
    const [isQuestoesOpen, setIsQuestoesOpen] = useState(false);
    const [isProvasOpen, setIsProvasOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoading(true));
            try {
                const analysis = await adminApi.getAnalysis();
                setDados(analysis.object || {});
            } catch {
                toast.error('Erro ao buscar os dados');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchData();
    }, [dispatch]);

    const fetchQuestoesParaRevisao = async (page) => {
        dispatch(setLoading(true));
        try {
            const response = await adminApi.getQuestoesParaRevisao({ page, quantity: quantityPerPage });
            setQuestoes(response.object || []);
            setPageQuestoes(page);
            setIsQuestoesOpen(true);
        } catch {
            toast.error('Erro ao buscar os dados');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchProvasParaRevisao = async (page) => {
        dispatch(setLoading(true));
        try {
            const response = await adminApi.getProvasParaRevisao({ page, quantity: quantityPerPage });
            setProvas(response.object || []);
            setPageProvas(page);
            setIsProvasOpen(true);
        } catch {
            toast.error('Erro ao buscar os dados');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const totalRespostas = Number(dados.quantidadeRespostas || 0);
    const quantidadeQuestoesRevisao = Number(dados.quantidadeQuestoesSolicitadasRevisao || 0);
    const quantidadeProvasAbertas = Number(dados.quantidadeProvasDesativasAtivas || 0);
    const reportesResumo = getReportesAbertosResumo(Number(dados.quantidadeReportesAbertos || 0), Number(dados.quantidadeQuestoesReportadas || 0));

    const respostasPorDia = new Map(safeList(dados.respostasDates).map((item) => [toDateKey(item.date), item]));
    const usuariosPorDia = new Map(safeList(dados.usuariosDates).map((item) => [toDateKey(item.date), Number(item.count || 0)]));
    const dias = buildDays(dados.dataReferencia).map((dia) => {
        const respostas = respostasPorDia.get(dia.key) || {};
        return {
            ...dia,
            certas: Number(respostas.certas || 0),
            erradas: Number(respostas.erradas || 0),
            usuariosAtivos: Number(respostas.usuariosAtivos || 0),
            novosUsuarios: usuariosPorDia.get(dia.key) || 0,
        };
    });
    const semanaAnterior = dias.slice(0, 7);
    const semanaAtual = dias.slice(7);
    const hoje = dias[dias.length - 1];

    const respostasSemana = sum(semanaAtual, 'certas') + sum(semanaAtual, 'erradas');
    const respostasSemanaAnterior = sum(semanaAnterior, 'certas') + sum(semanaAnterior, 'erradas');
    const acertoSemana = respostasSemana ? Math.round((sum(semanaAtual, 'certas') / respostasSemana) * 100) : 0;
    const acertoSemanaAnterior = respostasSemanaAnterior ? Math.round((sum(semanaAnterior, 'certas') / respostasSemanaAnterior) * 100) : 0;
    const novosUsuariosSemana = sum(semanaAtual, 'novosUsuarios');
    const novosUsuariosSemanaAnterior = sum(semanaAnterior, 'novosUsuarios');
    const questoesMaisRespondidas = safeList(dados.questoesMaisRespondidas);

    return (
        <div className="container-fluid py-4">
            <BaseModal isOpen={isQuestoesOpen} title="Questões com revisão solicitada" size="modal-lg" onClose={() => setIsQuestoesOpen(false)}
                footer={<Pagination page={pageQuestoes} totalPages={Math.ceil(quantidadeQuestoesRevisao / quantityPerPage)} onPageChange={fetchQuestoesParaRevisao} />}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Código</th>
                                <th scope="col">Matéria</th>
                                <th scope="col">Prova</th>
                                <th scope="col">Número da questão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questoes.map((item) => (
                                <tr key={getItemId(item)}>
                                    <td><Link to={`/questoes/${getItemId(item)}/editar`}>Ver #{getItemId(item)}</Link></td>
                                    <td>{item.materia}</td>
                                    <td>{item.prova?.nomeProva}</td>
                                    <td>{item.numeroQuestao}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </BaseModal>
            <BaseModal isOpen={isProvasOpen} title="Provas em revisão" size="modal-lg" onClose={() => setIsProvasOpen(false)}
                footer={<Pagination page={pageProvas} totalPages={Math.ceil(quantidadeProvasAbertas / quantityPerPage)} onPageChange={fetchProvasParaRevisao} />}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Código</th>
                                <th scope="col">Nome</th>
                                <th scope="col">Banca</th>
                                <th scope="col">Cadastro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {provas.map((item) => (
                                <tr key={getItemId(item)}>
                                    <td><Link to={`/provas/${getItemId(item)}/questoes`}>Ver #{getItemId(item)}</Link></td>
                                    <td>{item.nomeProva}</td>
                                    <td>{item.banca}</td>
                                    <td>{putDateOnPatternOnlyDate(item.dataRegistro)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </BaseModal>

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Dashboard</h1>
                    <p className="text-body-secondary mb-0">Últimos 7 dias comparados aos 7 dias anteriores.</p>
                </div>
                <Link to="/relatorios" className="btn btn-outline-secondary btn-sm"><i className="bi bi-bar-chart me-1" aria-hidden="true"></i>Ver relatórios</Link>
            </div>

            <div className={`alert ${reportesResumo.destaque ? 'alert-warning' : 'alert-light border'} d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4`} role={reportesResumo.destaque ? 'alert' : 'status'}>
                <div className="d-flex align-items-center gap-3">
                    <i className={`bi ${reportesResumo.destaque ? 'bi-exclamation-triangle-fill' : 'bi-flag'} fs-3`} aria-hidden="true"></i>
                    <div>
                        <strong className="d-block">{reportesResumo.titulo}</strong>
                        <span className="small">{reportesResumo.descricao}</span>
                    </div>
                </div>
                <Link to="/reportes-questoes" className={`btn btn-sm ${reportesResumo.destaque ? 'btn-warning' : 'btn-outline-secondary'}`}>Ver reportes</Link>
            </div>

            <div className="row g-3 mb-4">
                <KpiCard label="Respostas nos últimos 7 dias" value={formatNumber(respostasSemana)}
                    trend={<Trend current={respostasSemana} previous={respostasSemanaAnterior} />} note={`${formatNumber(hoje.certas + hoje.erradas)} hoje`} />
                <KpiCard label="Usuários ativos nos últimos 7 dias" value={formatNumber(dados.quantidadeUsuariosAtivos7Dias)}
                    trend={<Trend current={Number(dados.quantidadeUsuariosAtivos7Dias || 0)} previous={Number(dados.quantidadeUsuariosAtivos7DiasAnteriores || 0)} />} note={`${formatNumber(hoje.usuariosAtivos)} hoje`} />
                <KpiCard label="Novos usuários nos últimos 7 dias" value={formatNumber(novosUsuariosSemana)}
                    trend={<Trend current={novosUsuariosSemana} previous={novosUsuariosSemanaAnterior} />} note={`${formatNumber(dados.quantidadeTotal)} no total`} />
                <KpiCard label="Acerto nos últimos 7 dias" value={`${acertoSemana}%`}
                    trend={respostasSemanaAnterior ? <Trend diff={acertoSemana - acertoSemanaAnterior} suffix=" p.p." /> : <Trend />}
                    note={`${formatPercent(Number(dados.quantidadeRespostasCertas || 0), totalRespostas)} no histórico`} />
            </div>

            <div className="row g-3 mb-4">
                <div className="col-lg-8">
                    <ChartCard title="Respostas por dia" description={`Certas e erradas nos últimos ${diasGrafico} dias.`}>
                        <ColumnChart items={dias.map((dia) => ({ label: dia.label, primary: dia.certas, secondary: dia.erradas }))} primaryLabel="Certas" secondaryLabel="Erradas" />
                    </ChartCard>
                </div>
                <div className="col-lg-4">
                    <ChartCard title="Fila de trabalho" description="O que está aguardando ação do admin.">
                        <ul className="list-group list-group-flush">
                            <QueueItem icon="bi-flag" label="Reportes em aberto" value={dados.quantidadeReportesAbertos}
                                action={<Link to="/reportes-questoes" className="btn btn-outline-secondary btn-sm" title="Ver reportes" aria-label="Ver reportes"><i className="bi bi-eye" aria-hidden="true"></i></Link>} />
                            <QueueItem icon="bi-folder" label="Questões pedindo revisão" value={quantidadeQuestoesRevisao}
                                action={<button type="button" className="btn btn-outline-secondary btn-sm" title="Ver questões para revisão" aria-label="Ver questões para revisão" onClick={() => fetchQuestoesParaRevisao(1)}><i className="bi bi-eye" aria-hidden="true"></i></button>} />
                            <QueueItem icon="bi-book" label="Provas em aberto" value={quantidadeProvasAbertas}
                                action={<button type="button" className="btn btn-outline-secondary btn-sm" title="Ver provas em revisão" aria-label="Ver provas em revisão" onClick={() => fetchProvasParaRevisao(1)}><i className="bi bi-eye" aria-hidden="true"></i></button>} />
                            <QueueItem icon="bi-person-exclamation" label="Contas não verificadas" value={dados.quantidadeNaoVerificados} />
                        </ul>
                    </ChartCard>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-lg-6">
                    <ChartCard title="Usuários ativos por dia" description="Usuários que responderam ao menos uma questão no dia.">
                        <ColumnChart items={dias.map((dia) => ({ label: dia.label, primary: dia.usuariosAtivos }))} primaryLabel="usuários ativos" />
                    </ChartCard>
                </div>
                <div className="col-lg-6">
                    <ChartCard title="Novos usuários por dia" description="Contas criadas no dia.">
                        <ColumnChart items={dias.map((dia) => ({ label: dia.label, primary: dia.novosUsuarios }))} primaryLabel="novos usuários" />
                    </ChartCard>
                </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="h5 mb-1">Questões mais respondidas</h2>
                    <p className="text-body-secondary small">As 10 questões com mais respostas nos últimos 7 dias. Taxa de erro alta pode indicar gabarito ou enunciado com problema.</p>
                    {questoesMaisRespondidas.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">Questão</th>
                                        <th scope="col">Prova</th>
                                        <th scope="col">Matéria</th>
                                        <th scope="col" className="text-end">Respostas</th>
                                        <th scope="col" className="text-end">Erro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questoesMaisRespondidas.map((item) => {
                                        const total = Number(item.certas || 0) + Number(item.erradas || 0);
                                        const erro = total ? Math.round((Number(item.erradas || 0) / total) * 100) : 0;
                                        return (
                                            <tr key={item.codigo}>
                                                <td><Link to={`/questoes/${item.codigo}/editar`}>#{item.codigo}</Link><span className="text-body-secondary small ms-1">(nº {item.numeroQuestao})</span></td>
                                                <td>{item.prova}</td>
                                                <td>{item.materia}</td>
                                                <td className="text-end">{formatNumber(total)}</td>
                                                <td className="text-end"><span className={`badge ${erro >= 70 ? 'text-bg-warning' : 'text-bg-light border'}`}>{erro}%</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-body-secondary mb-0">Nenhuma resposta nos últimos 7 dias.</p>
                    )}
                </div>
            </div>

            <div className="row g-3">
                <KpiCard label="Questões ativas" value={formatNumber(dados.quantidadeQuestoesAtivas)} note={`${formatNumber(totalRespostas)} respostas no histórico`} />
                <KpiCard label="Provas ativas" value={formatNumber(dados.quantidadeProvasAtivas)} />
                <KpiCard label="Usuários" value={formatNumber(dados.quantidadeTotal)} note={`${formatNumber(dados.quantidadeVerificados)} verificados`} />
                <KpiCard label="Tabuada Divertida" value={formatNumber(dados.quantidadeRespostasTabuadaDivertida7Dias)}
                    note={`partidas nos últimos 7 dias · ${formatNumber(dados.quantidadeRespostasTabuadaDivertidaUltimas30Dias)} em 30 dias`} />
            </div>
        </div>
    );
};

export default DashboardPage;
