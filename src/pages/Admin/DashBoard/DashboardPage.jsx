import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../../../services/apiServices/adminApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import BaseModal from '../../../components/common/Modals/BaseModal/BaseModal';
import Pagination from '../../../components/common/Pagination/Pagination';
import { BarList, StackedBarList } from '../../../components/admin/Charts/BarList';
import { putDateOnPatternOnlyDate } from '../../../utils/functions';

const quantityPerPage = 8;
const numberFormatter = new Intl.NumberFormat('pt-BR');

const safeList = (list) => (Array.isArray(list) ? list : []);
const formatNumber = (value) => numberFormatter.format(Number(value || 0));
const formatPercent = (value, total) => (total ? `${Math.round((value / total) * 100)}%` : '0%');
const getItemId = (item) => item?.id ?? item?.Id;
const toStackedItems = (list) => safeList(list).map((item) => ({ label: item.descricao, primary: Number(item.certas || 0), secondary: Number(item.erradas || 0) }));
const toBarItems = (list) => safeList(list).map((item) => ({ label: item.descricao, value: Number(item.valor || 0) }));

const StatCard = ({ label, value, note, action }) => (
    <div className="col-sm-6 col-xl-3">
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-start gap-2">
                <div>
                    <span className="text-body-secondary small">{label}</span>
                    <strong className="d-block fs-3">{formatNumber(value)}</strong>
                    {note && <span className="text-body-secondary small">{note}</span>}
                </div>
                {action}
            </div>
        </div>
    </div>
);

const ReportSection = ({ title, description, items }) => {
    const list = toStackedItems(items);
    const total = list.reduce((sum, item) => sum + item.primary + item.secondary, 0);
    const correct = list.reduce((sum, item) => sum + item.primary, 0);

    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
                <h2 className="h5 mb-1">{title}</h2>
                <p className="text-body-secondary small">{description}</p>
                {list.length > 0 ? (
                    <>
                        <p className="small mb-3">
                            <strong>{formatNumber(total)}</strong> respostas registradas · <strong>{formatPercent(correct, total)}</strong> de aproveitamento
                        </p>
                        <StackedBarList items={list} />
                    </>
                ) : (
                    <p className="text-body-secondary mb-0">Sem dados para este recorte.</p>
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
            {items.length > 0 ? <BarList items={items} /> : <p className="text-body-secondary mb-0">Sem dados para este recorte.</p>}
        </div>
    </div>
);

const DashboardPage = () => {
    const dispatch = useDispatch();
    const [dados, setDados] = useState({});
    const [questoesPorUsuarios, setQuestoesPorUsuarios] = useState([]);
    const [questoesValidadasPorUsuarios, setQuestoesValidadasPorUsuarios] = useState([]);
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
                const [analysis, cadastradas, validadas] = await Promise.all([
                    adminApi.getAnalysis(),
                    adminApi.getQuestoesCadastradasPorUsuarios(),
                    adminApi.getQuestoesValidadasPorUsuarios(),
                ]);
                setDados(analysis.object || {});
                setQuestoesPorUsuarios(toBarItems(cadastradas.object));
                setQuestoesValidadasPorUsuarios(toBarItems(validadas.object));
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
    const respostasUltimos30Dias = Number(dados.quantidadeRespostasUltimas30Dias || 0);
    const quantidadeQuestoesRevisao = Number(dados.quantidadeQuestoesSolicitadasRevisao || 0);
    const quantidadeProvasAbertas = Number(dados.quantidadeProvasDesativasAtivas || 0);
    const tabuadaTotal = Number(dados.quantidadeRespostasTabuadaDivertida || 0);
    const tabuadaUltimos30Dias = Number(dados.quantidadeRespostasTabuadaDivertidaUltimas30Dias || 0);
    const usuariosDates = safeList(dados.usuariosDates).map((item) => ({ label: putDateOnPatternOnlyDate(item.date), value: item.count }));

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
                    <p className="text-body-secondary mb-0">Visão consolidada de usuários, respostas e itens que precisam de revisão.</p>
                </div>
                <div className="text-end">
                    <strong className="d-block fs-3 text-app-primary">{formatPercent(Number(dados.quantidadeRespostasCertas || 0), totalRespostas)}</strong>
                    <span className="text-body-secondary small">acerto geral</span>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <StatCard label="Usuários" value={dados.quantidadeTotal} note={`${formatNumber(dados.quantidadeUsuarios30Dias)} nos últimos 30 dias`} />
                <StatCard label="Respostas" value={totalRespostas} note={`${formatNumber(respostasUltimos30Dias)} nos últimos 30 dias`} />
                <StatCard label="Questões ativas" value={dados.quantidadeQuestoesAtivas} note={`${formatNumber(quantidadeQuestoesRevisao)} pedindo revisão`}
                    action={<button type="button" className="btn btn-outline-secondary btn-sm" title="Ver questões para revisão" aria-label="Ver questões para revisão" onClick={() => fetchQuestoesParaRevisao(1)}><i className="bi bi-eye" aria-hidden="true"></i></button>} />
                <StatCard label="Provas ativas" value={dados.quantidadeProvasAtivas} note={`${formatNumber(quantidadeProvasAbertas)} em aberto`}
                    action={<button type="button" className="btn btn-outline-secondary btn-sm" title="Ver provas em revisão" aria-label="Ver provas em revisão" onClick={() => fetchProvasParaRevisao(1)}><i className="bi bi-eye" aria-hidden="true"></i></button>} />
            </div>

            <div className="row g-3">
                <div className="col-lg-6">
                    <SimpleSection title="Usuários verificados" description={`${formatNumber(dados.quantidadeNaoVerificados)} contas ainda precisam de verificação.`}
                        items={[{ label: 'Verificados', value: Number(dados.quantidadeVerificados || 0) }, { label: 'Não verificados', value: Number(dados.quantidadeNaoVerificados || 0) }]} />
                </div>
                <div className="col-lg-6">
                    <SimpleSection title="Atividade recente" description="Participação dos últimos 30 dias no volume total de respostas."
                        items={[{ label: 'Últimos 30 dias', value: respostasUltimos30Dias }, { label: 'Histórico anterior', value: Math.max(totalRespostas - respostasUltimos30Dias, 0) }]} />
                </div>
            </div>

            <ReportSection title="Respostas por prova" description="Volume e aproveitamento agrupados por prova." items={dados.respostasPorProvas} />
            <ReportSection title="Respostas por avaliação" description="Comparação entre acertos e erros em avaliações." items={dados.respostasPorAvaliacao} />
            <ReportSection title="Respostas por matéria" description="Matérias com maior participação e melhor leitura de desempenho." items={dados.respostasPorMateria} />
            <ReportSection title="Respostas por banca" description="Distribuição de respostas por banca." items={dados.respostasPorBanca} />
            <ReportSection title="Respostas por tipo" description="Desempenho por tipo de questão." items={dados.respostasPorTipo} />
            <SimpleSection title="Questões cadastradas por usuário" description="Quem mais contribuiu com cadastro de questões." items={questoesPorUsuarios} />
            <SimpleSection title="Questões validadas por usuário" description="Quem mais atuou na validação de questões." items={questoesValidadasPorUsuarios} />
            <SimpleSection title="Usuários cadastrados nos últimos 30 dias" description="Evolução diária de novos usuários." items={usuariosDates} />
            <SimpleSection title="Tabuada Divertida" description="Resumo de uso do módulo e participação da atividade recente no histórico."
                items={[{ label: 'Últimos 30 dias', value: tabuadaUltimos30Dias }, { label: 'Histórico anterior', value: Math.max(tabuadaTotal - tabuadaUltimos30Dias, 0) }]} />
        </div>
    );
};

export default DashboardPage;
