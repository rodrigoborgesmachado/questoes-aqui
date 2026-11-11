import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import StatCard from '../../../components/client/StatCard/StatCard';
import { selectUserCode, selectUserName } from '../../../services/redux/authSlice';
import { putDateOnPattern, putDateOnPatternOnlyDate } from '../../../utils/functions';
import useHomeData from './useHomeData';
import LandingPage from './LandingPage';
import './HomePage.css';

const RANDOM_PRACTICE = '/praticar?tipo=GENERIC&randon=true';
const numberFormatter = new Intl.NumberFormat('pt-BR');
const toCount = (value) => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
const getPercentage = (correct, total) => Math.min(100, Math.round((correct / total) * 100));

const practiceItems = [
    { to: '/praticar?tipo=ENEM&randon=true', icon: 'bi-lightning-charge', title: 'Questões do ENEM', text: 'Treine com questões de edições anteriores e confira o gabarito após responder.', action: 'Praticar ENEM' },
    { to: '/praticar?tipo=IFTM&randon=true', icon: 'bi-bullseye', title: 'Questões do IFTM', text: 'Familiarize-se com as questões do processo seletivo do IFTM.', action: 'Praticar IFTM' },
    { to: RANDOM_PRACTICE, icon: 'bi-shuffle', title: 'Treino livre', text: 'Misture provas e assuntos para variar a sua sessão de estudo.', action: 'Sortear uma questão' },
    { to: '/provas', icon: 'bi-stopwatch', title: 'Modo simulado', text: 'Escolha uma prova, acompanhe o cronômetro e veja o resultado ao finalizar.', action: 'Escolher uma prova' },
];

const exploreItems = [
    { to: '/provas', icon: 'bi-journal-text', title: 'Provas anteriores', text: 'Consulte o acervo por banca e tipo de prova antes de escolher seu próximo treino.', action: 'Explorar provas' },
    { to: '/questoes', icon: 'bi-collection', title: 'Banco de questões', text: 'Filtre por matéria, banca ou tipo de prova para encontrar o conteúdo que procura.', action: 'Buscar questões' },
];

const ActionCard = ({ item, columns = 'col-sm-6 col-xl-3' }) => (
    <div className={columns}>
        <Link to={item.to} className="card border-0 shadow-sm h-100 text-decoration-none client-action-card home-action-card">
            <div className="card-body p-4">
                <span className="client-icon-circle mb-3"><i className={`bi ${item.icon} fs-5`} aria-hidden="true"></i></span>
                <h3 className="h6 mb-2">{item.title}</h3>
                <p className="small text-body-secondary mb-4">{item.text}</p>
                <span className="home-action-label mt-auto">{item.action}<i className="bi bi-arrow-right" aria-hidden="true"></i></span>
            </div>
        </Link>
    </div>
);

const ResourceContent = ({ resource, label, children }) => {
    if (resource.status === 'loading') {
        return <p className="home-resource-state mb-0" role="status"><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Carregando {label}...</p>;
    }
    if (resource.status === 'error') {
        return <p className="home-resource-state mb-0">Não foi possível carregar {label}. Tente novamente no aviso acima.</p>;
    }
    return children;
};

const HomeHero = ({ isAuthenticated, userName }) => (
    <section className="client-hero p-4 p-lg-5 shadow-sm" aria-labelledby="home-title">
        <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-8">
                <p className="home-eyebrow text-hero-muted mb-3">{isAuthenticated ? 'Seu espaço de estudo' : 'ENEM, vestibulares e processos seletivos'}</p>
                <h1 id="home-title" className="display-6 fw-semibold home-hero-title mb-3">
                    {isAuthenticated ? `Olá${userName ? `, ${userName}` : ''}!` : 'Seu próximo passo começa com uma questão.'}
                </h1>
                <p className="text-hero-muted mb-4">
                    {isAuthenticated
                        ? 'Acompanhe seus resultados, encontre um assunto para revisar e faça desta sessão mais um passo na sua preparação.'
                        : 'Estude com questões de provas reais. Explore o acervo, pratique no seu ritmo e descubra quais assuntos merecem mais atenção.'}
                </p>
                <div className="d-flex flex-wrap gap-2">
                    <Link to={isAuthenticated ? RANDOM_PRACTICE : '/criar-conta'} className="btn btn-light">
                        <i className={`bi ${isAuthenticated ? 'bi-play-fill' : 'bi-person-plus'} me-2`} aria-hidden="true"></i>
                        {isAuthenticated ? 'Começar um treino' : 'Criar conta grátis'}
                    </Link>
                    <Link to={isAuthenticated ? '/desempenho' : '/provas'} className="btn btn-outline-light">{isAuthenticated ? 'Ver meu desempenho' : 'Explorar provas'}</Link>
                </div>
            </div>
            <div className="col-lg-4">
                <div className="home-hero-note p-4">
                    <i className="bi bi-compass fs-3 d-block mb-3" aria-hidden="true"></i>
                    <h2 className="h6 text-reset">{isAuthenticated ? 'Seu próximo passo' : 'Uma questão de cada vez'}</h2>
                    <p className="small text-hero-muted mb-0">
                        {isAuthenticated ? 'Use seu histórico para escolher o que revisar. As matérias e as últimas respostas estão logo abaixo.' : 'Não precisa resolver uma prova inteira de uma vez. Escolha um assunto, faça sua tentativa e volte aos pontos que precisam de revisão.'}
                    </p>
                    {isAuthenticated && <a href="#home-subjects-title" className="small text-reset d-inline-block mt-3">Ver o que revisar<i className="bi bi-arrow-down ms-2" aria-hidden="true"></i></a>}
                </div>
            </div>
        </div>
    </section>
);

const SubjectFocus = ({ analysis }) => {
    const hasAttempts = toCount(analysis.data?.quantidadeQuestoesTentadas) > 0;
    const subjects = (Array.isArray(analysis.data?.respostasPorMateria) ? analysis.data.respostasPorMateria : [])
        .filter((item) => item?.descricao)
        .map((item) => {
            const correct = toCount(item.certas);
            const incorrect = toCount(item.erradas);
            return { name: item.descricao, correct, incorrect, total: correct + incorrect };
        })
        .filter((item) => item.total > 0)
        .sort((a, b) => b.incorrect - a.incorrect || b.total - a.total)
        .slice(0, 3);
    const focus = subjects.find((subject) => subject.incorrect > 0);

    return (
        <section className="card border-0 shadow-sm h-100" aria-labelledby="home-subjects-title">
            <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <h2 id="home-subjects-title" className="h5 mb-0">Onde concentrar seus estudos</h2>
                    <Link to="/desempenho" className="small">Ver desempenho</Link>
                </div>
                <p className="small text-body-secondary mb-4">Até três matérias, priorizando as que têm mais respostas incorretas.</p>
                <ResourceContent resource={analysis} label="suas matérias">
                    {subjects.length > 0 ? (
                        <>
                            {focus && <p className="home-focus small mb-4"><i className="bi bi-lightbulb me-2 text-app-primary" aria-hidden="true"></i>Que tal revisar <strong>{focus.name}</strong>? Você tem {focus.incorrect} {focus.incorrect === 1 ? 'resposta incorreta' : 'respostas incorretas'} nessa matéria.</p>}
                            {subjects.map((subject) => {
                                const percentage = getPercentage(subject.correct, subject.total);
                                return (
                                    <div key={subject.name} className="home-subject-row">
                                        <div className="d-flex justify-content-between align-items-center gap-3">
                                            <div className="home-subject-name flex-grow-1">
                                                <h3 className="h6 mb-1">{subject.name}</h3>
                                                <p className="small text-body-secondary mb-2">{subject.correct} de {subject.total} acertos · {percentage}%</p>
                                            </div>
                                            <Link to={`/praticar?${new URLSearchParams({ materias: subject.name, randon: 'true' })}`} className="btn btn-outline-primary btn-sm flex-shrink-0" aria-label={`Praticar ${subject.name}`}>Praticar</Link>
                                        </div>
                                        <div className="progress client-progress home-subject-progress" role="progressbar" aria-label={`Aproveitamento em ${subject.name}`} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
                                            <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <div className="home-resource-state">
                            <i className="bi bi-bar-chart fs-2 text-app-primary d-block mb-3" aria-hidden="true"></i>
                            <h3 className="h6">{hasAttempts ? 'Continue construindo seu mapa de estudos' : 'Seu mapa de estudos começa aqui'}</h3>
                            <p className="small">{hasAttempts ? 'Ainda não há um detalhamento por matéria disponível. Enquanto isso, use seu histórico para escolher questões para revisar.' : 'Responda algumas questões para descobrir seu aproveitamento por matéria e escolher o que revisar.'}</p>
                            <Link to={RANDOM_PRACTICE} className="btn btn-outline-primary btn-sm">Responder questões</Link>
                        </div>
                    )}
                </ResourceContent>
            </div>
        </section>
    );
};

const RecentAnswers = ({ history }) => (
    <section className="card border-0 shadow-sm h-100" aria-labelledby="home-history-title">
        <div className="card-body p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <h2 id="home-history-title" className="h5 mb-0">Suas últimas respostas</h2>
                <Link to="/historico" className="small">Ver histórico</Link>
            </div>
            <p className="small text-body-secondary mb-4">Volte a uma questão e faça uma nova tentativa.</p>
            <ResourceContent resource={history} label="seu histórico">
                {history.data?.length > 0 ? (
                    <ul className="home-activity-list">
                        {history.data.map((item, index) => {
                            const correct = `${item.respostaCorreta}` === '1';
                            return (
                                <li key={`${item.codigoQuestao}-${index}`} className="d-flex align-items-start gap-3">
                                    <i className={`bi ${correct ? 'bi-check-circle text-success' : 'bi-arrow-repeat text-danger'} fs-5 mt-1`} aria-hidden="true"></i>
                                    <div className="home-activity-content">
                                        <span className={`small ${correct ? 'text-success' : 'text-danger'}`}>{correct ? 'Resposta correta' : 'Para revisar'}</span>
                                        <h3 className="h6 mb-1">{item.nomeProva || 'Questão de prova'}</h3>
                                        <p className="small text-body-secondary mb-1">Questão {item.numeroQuestao} · {putDateOnPattern(item.dataResposta)}</p>
                                        <Link to={`/praticar?id=${item.codigoQuestao}`} className="small" aria-label={`Refazer questão ${item.numeroQuestao} de ${item.nomeProva || 'prova'}`}>Refazer questão<i className="bi bi-arrow-right ms-2" aria-hidden="true"></i></Link>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : <p className="home-resource-state mb-0">Ainda não há respostas no seu histórico. Seu primeiro treino já pode começar pelos atalhos acima.</p>}
            </ResourceContent>
        </div>
    </section>
);

const StudyRoutine = ({ isAuthenticated }) => {
    const steps = [
        { title: 'Escolha um foco', text: 'Defina uma matéria ou uma prova para esta sessão.', to: '/questoes', action: 'Encontrar questões' },
        { title: 'Tente antes de conferir', text: 'Leia o enunciado, resolva e depois confira a alternativa correta.', to: RANDOM_PRACTICE, action: 'Começar um treino' },
        { title: 'Volte ao que você errou', text: 'Refaça questões do histórico para conferir se entendeu o conteúdo.', to: isAuthenticated ? '/historico' : '/criar-conta', action: isAuthenticated ? 'Revisar meu histórico' : 'Criar conta e salvar progresso' },
    ];
    return (
        <section className="card border-0 shadow-sm h-100" aria-labelledby="home-routine-title">
            <div className="card-body p-4">
                <p className="home-eyebrow text-app-primary mb-2">Da tentativa à revisão</p>
                <h2 id="home-routine-title" className="h5 mb-4">Um roteiro para a próxima sessão</h2>
                <ol className="home-activity-list">
                    {steps.map((step, index) => (
                        <li key={step.title} className="d-flex gap-3">
                            <span className="home-step-number" aria-hidden="true">{index + 1}</span>
                            <div>
                                <h3 className="h6 mb-1">{step.title}</h3>
                                <p className="small text-body-secondary mb-1">{step.text}</p>
                                <Link to={step.to} className="small">{step.action}<i className="bi bi-arrow-right ms-2" aria-hidden="true"></i></Link>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

const SimulationSummary = ({ simulations }) => (
    <section className="card border-0 shadow-sm h-100" aria-labelledby="home-simulations-title">
        <div className="card-body p-4 d-flex flex-column">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <h2 id="home-simulations-title" className="h5 mb-0">Seus simulados</h2>
                <Link to="/simulados" className="small">Ver todos</Link>
            </div>
            <p className="small text-body-secondary mb-4">Reveja seus resultados ou experimente uma prova completa.</p>
            <ResourceContent resource={simulations} label="seus simulados">
                {simulations.data?.length > 0 ? (
                    <ul className="home-activity-list mb-4">
                        {simulations.data.map((item) => {
                            const total = toCount(item.quantidadeQuestoes);
                            const correct = toCount(item.quantidadeCertas);
                            return (
                                <li key={item.codigo}>
                                    <div className="d-flex align-items-start justify-content-between gap-3 mb-1">
                                        <h3 className="h6 mb-0 home-subject-name">{item.prova?.nomeProva || 'Simulado'}</h3>
                                        <strong className="text-app-primary flex-shrink-0">{total > 0 ? `${getPercentage(correct, total)}%` : '—'}</strong>
                                    </div>
                                    <p className="small text-body-secondary mb-1">{correct}/{total} acertos{item.created && ` · ${putDateOnPatternOnlyDate(item.created)}`}</p>
                                    <Link to={`/simulados/resultado/${item.codigo}`} className="small" aria-label={`Ver resultado de ${item.prova?.nomeProva || 'simulado'}`}>Ver resultado<i className="bi bi-arrow-right ms-2" aria-hidden="true"></i></Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="mb-4">
                        <i className="bi bi-stopwatch fs-2 text-app-primary d-block mb-2" aria-hidden="true"></i>
                        <h3 className="h6">Que tal fazer seu primeiro simulado?</h3>
                        <p className="small text-body-secondary mb-0">Aqui, o gabarito vem ao finalizar. Escolha uma prova para treinar com cronômetro e conferir seus acertos no final.</p>
                    </div>
                )}
            </ResourceContent>
            <Link to="/provas" className="btn btn-outline-primary align-self-start mt-auto">Escolher uma prova</Link>
        </div>
    </section>
);

const GuestBenefits = () => (
    <section className="card border-0 shadow-sm h-100" aria-labelledby="home-account-title">
        <div className="card-body p-4 d-flex flex-column">
            <span className="client-icon-circle mb-3"><i className="bi bi-graph-up-arrow fs-5" aria-hidden="true"></i></span>
            <h2 id="home-account-title" className="h5 mb-2">Sua evolução tem um lugar</h2>
            <p className="small text-body-secondary">Você pode consultar provas e questões sem entrar. Com uma conta, também pode:</p>
            <ul className="list-unstyled small mb-4">
                {['Responder e guardar seu histórico.', 'Acompanhar o aproveitamento por matéria.', 'Consultar os resultados dos seus simulados.'].map((text) => (
                    <li key={text} className="d-flex gap-2 mb-2"><i className="bi bi-check2 text-app-primary" aria-hidden="true"></i>{text}</li>
                ))}
            </ul>
            <div className="mt-auto">
                <Link to="/criar-conta" className="btn btn-primary mb-3">Criar conta grátis</Link>
                <p className="small text-body-secondary mb-0">Já tem uma conta? <Link to="/entrar">Entrar</Link></p>
            </div>
        </div>
    </section>
);

const HomeContent = ({ isAuthenticated, userName }) => {
    const { analysis, history, simulations, retry } = useHomeData(isAuthenticated);
    const data = analysis.data;
    const ready = analysis.status === 'ready';
    const attempted = toCount(data?.quantidadeQuestoesTentadas);
    const correct = toCount(data?.quantidadeQuestoesResolvidasCorretas);
    const stats = [
        { icon: 'bi-pencil-square', label: 'Questões tentadas', value: numberFormatter.format(attempted), note: 'Seu histórico de prática' },
        { icon: 'bi-check2-circle', label: 'Corretas', value: numberFormatter.format(correct), note: 'Acertos registrados' },
        { icon: 'bi-arrow-repeat', label: 'Incorretas', value: numberFormatter.format(toCount(data?.quantidadeQuestoesIncorretas)), note: 'Oportunidades para revisar' },
        { icon: 'bi-percent', label: 'Aproveitamento', value: attempted > 0 ? `${getPercentage(correct, attempted)}%` : '—', note: attempted > 0 ? 'Acertos ÷ questões tentadas' : 'Responda para começar' },
    ];
    const hasErrors = [analysis, history, simulations].some((resource) => resource.status === 'error');

    return (
        <div className="home-page">
            <HomeHero isAuthenticated={isAuthenticated} userName={userName} />

            {isAuthenticated && (
                <section aria-labelledby="home-progress-title">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <h2 id="home-progress-title" className="h5 mb-0">Seu progresso até aqui</h2>
                        <span className="small text-body-secondary">Resumo de todo o seu histórico</span>
                    </div>
                    {hasErrors && <div className="alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-2" role="status"><span>Parte do seu resumo está indisponível. Você pode continuar praticando.</span><button type="button" className="btn btn-outline-secondary btn-sm" onClick={retry}>Tentar novamente</button></div>}
                    <div className="row g-3" aria-busy={analysis.status === 'loading'}>
                        {stats.map((stat) => (
                            <div key={stat.label} className="col-sm-6 col-xl-3">
                                <StatCard {...stat} value={ready ? stat.value : '—'} note={ready ? stat.note : analysis.status === 'loading' ? 'Carregando seu resumo...' : 'Resumo indisponível'} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {isAuthenticated && (
                <div className="row g-4">
                    <div className="col-lg-6"><SubjectFocus analysis={analysis} /></div>
                    <div className="col-lg-6"><RecentAnswers history={history} /></div>
                </div>
            )}

            <section aria-labelledby="home-practice-title">
                <h2 id="home-practice-title" className="h5 mb-1">Como você quer estudar hoje?</h2>
                <p className="small text-body-secondary mb-3">Escolha um objetivo e vá direto para a prática.</p>
                <div className="row g-3">{practiceItems.map((item) => <ActionCard key={item.to} item={item} />)}</div>
            </section>

            <div className="row g-4">
                <div className="col-lg-7"><StudyRoutine isAuthenticated={isAuthenticated} /></div>
                <div className="col-lg-5">{isAuthenticated ? <SimulationSummary simulations={simulations} /> : <GuestBenefits />}</div>
            </div>

            <section aria-labelledby="home-explore-title">
                <h2 id="home-explore-title" className="h5 mb-1">Explore outras possibilidades</h2>
                <p className="small text-body-secondary mb-3">Encontre seu próximo conteúdo de estudo.</p>
                <div className="row g-3">
                    {exploreItems.map((item) => <ActionCard key={item.to} item={item} columns={isAuthenticated ? 'col-md-4' : 'col-md-6'} />)}
                    {isAuthenticated && <ActionCard columns="col-md-4" item={{ to: '/ranking', icon: 'bi-trophy', title: 'Ranking de estudantes', text: 'Conheça os estudantes com mais questões respondidas corretamente.', action: 'Consultar ranking' }} />}
                </div>
            </section>
        </div>
    );
};

const HomePage = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userName = useSelector(selectUserName);
    const userCode = useSelector(selectUserCode);

    if (!isAuthenticated) {
        return <LandingPage />;
    }

    // Reset personal data whenever the account or authentication state changes.
    return <HomeContent key={isAuthenticated ? `member-${userCode}` : 'guest'} isAuthenticated={isAuthenticated} userName={userName} />;
};

export default HomePage;
