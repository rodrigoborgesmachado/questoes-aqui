import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const studySteps = [
    { icon: 'bi-search', title: 'Encontre seu ponto de partida', text: 'Explore questões e provas anteriores. Filtre por matéria, banca ou tipo de prova para escolher o que estudar.' },
    { icon: 'bi-pencil-square', title: 'Transforme teoria em tentativa', text: 'Com sua conta, responda no modo de prática ou escolha uma prova para treinar com cronômetro.' },
    { icon: 'bi-arrow-repeat', title: 'Use cada resposta para revisar', text: 'Confira seus acertos, retome as questões do histórico e volte aos conteúdos em que ficou com dúvida.' },
];

const goals = [
    { icon: 'bi-lightning-charge', title: 'ENEM', text: 'Leve a revisão para a prática com questões de edições anteriores do exame.', to: '/praticar?tipo=ENEM&randon=true', action: 'Praticar ENEM' },
    { icon: 'bi-bullseye', title: 'IFTM', text: 'Conheça o estilo das questões e pratique para o processo seletivo do instituto.', to: '/praticar?tipo=IFTM&randon=true', action: 'Praticar IFTM' },
    { icon: 'bi-journal-text', title: 'Outras provas e vestibulares', text: 'Explore o acervo para encontrar provas e assuntos que fazem parte da sua preparação.', to: '/provas', action: 'Conhecer o acervo' },
];

const benefits = [
    { icon: 'bi-bar-chart', title: 'Enxergue seu aproveitamento', text: 'Consulte os acertos e erros registrados e o desempenho por matéria quando houver dados disponíveis.' },
    { icon: 'bi-clock-history', title: 'Tenha um histórico para revisitar', text: 'Volte às suas respostas e refaça uma questão para conferir se o conteúdo ficou mais claro.' },
    { icon: 'bi-stopwatch', title: 'Treine em modo simulado', text: 'Resolva uma sequência de questões com cronômetro e consulte o resultado ao finalizar.' },
];

const questions = [
    { title: 'Posso explorar sem criar uma conta?', text: 'Sim. Você pode consultar questões, provas e notas de corte do Sisu, além de usar a calculadora de média do ENEM, sem login. Para praticar com registro de respostas, fazer simulados e acompanhar seu histórico, crie uma conta ou entre na plataforma.' },
    { title: 'Qual é a diferença entre prática e simulado?', text: 'Na prática, você confere a alternativa correta depois de responder cada questão. No simulado, resolve uma sequência com cronômetro e consulta o resultado ao finalizar. Escolha o modo de acordo com o objetivo da sua sessão.' },
    { title: 'Como acompanho minha evolução?', text: 'Com sua conta, suas respostas ficam no histórico. A tela inicial e a página de desempenho mostram os resultados disponíveis, incluindo acertos, erros e aproveitamento por matéria, para ajudar a decidir o que revisar.' },
    { title: 'As notas de corte e a calculadora garantem aprovação?', text: 'Não. As notas de corte são referências históricas da base consultada. A calculadora aplica os pesos às notas informadas, sem calcular a TRI. Confira os critérios e os pesos da edição desejada nos documentos oficiais da instituição.' },
    { title: 'O Questões Aqui é um site oficial do Sisu, do ENEM ou do IFTM?', text: 'Não. O Questões Aqui é uma plataforma educacional da SunSale System. Para datas, regras, inscrições e conteúdos oficiais, consulte o Inep ou a instituição responsável pelo processo seletivo.' },
];

const DemoQuestion = () => {
    const [selected, setSelected] = useState(null);
    const answered = selected !== null;

    return (
        <div className="landing-demo" aria-labelledby="landing-demo-title">
            <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
                <span className="landing-kicker mb-0"><i className="bi bi-pencil-square me-2" aria-hidden="true"></i>Experimente a ideia</span>
                <span className="landing-demo-tag">Demonstração</span>
            </div>
            <p className="small text-body-secondary mb-2">Matemática · Porcentagem</p>
            <h2 id="landing-demo-title" className="h5 mb-3">Um pequeno treino para começar</h2>
            <fieldset className="border-0 p-0 m-0">
                <legend className="landing-demo-question">Uma turma tem 40 estudantes. Se 25% vão à escola de bicicleta, quantos estudantes usam bicicleta?</legend>
                <div className="landing-demo-options">
                    {[8, 10, 15, 20].map((value, index) => (
                        <button
                            key={value}
                            type="button"
                            className={`landing-demo-option ${answered && value === 10 ? 'is-correct' : ''} ${selected === value && value !== 10 ? 'is-wrong' : ''}`}
                            aria-label={`Alternativa ${String.fromCharCode(65 + index)}: ${value} estudantes${answered && value === 10 ? ', resposta correta' : ''}`}
                            aria-pressed={selected === value}
                            disabled={answered}
                            onClick={() => setSelected(value)}
                        >
                            <span className="landing-option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                            <span>{value} estudantes</span>
                            {answered && value === 10 && <i className="bi bi-check-circle-fill ms-auto" aria-hidden="true"></i>}
                        </button>
                    ))}
                </div>
            </fieldset>
            <div className="landing-demo-feedback" role="status" aria-live="polite" aria-atomic="true">
                {answered ? (
                    <div className="pt-3">
                        <strong className={selected === 10 ? 'text-success' : 'text-body'}>{selected === 10 ? 'Isso mesmo!' : 'Vamos conferir o raciocínio?'}</strong>
                        <p className="small text-body-secondary mt-1 mb-2">25% é um quarto do total. Então, 40 ÷ 4 = 10 estudantes.</p>
                        <button type="button" className="btn btn-link btn-sm p-0" onClick={() => setSelected(null)}>Refazer demonstração<i className="bi bi-arrow-counterclockwise ms-2" aria-hidden="true"></i></button>
                    </div>
                ) : <p className="small text-body-secondary pt-3 mb-0"><i className="bi bi-hand-index me-2" aria-hidden="true"></i>Escolha uma alternativa para conferir a resposta.</p>}
            </div>
            <p className="landing-demo-disclaimer small mb-0">Questão ilustrativa. Esta demonstração não salva resultados no seu histórico.</p>
        </div>
    );
};

const LandingPage = () => (
    <div className="landing-page">
        <section className="landing-hero" aria-labelledby="landing-title">
            <div className="landing-hero-copy">
                <p className="landing-kicker"><i className="bi bi-mortarboard me-2" aria-hidden="true"></i>ENEM, vestibulares e processos seletivos</p>
                <h1 id="landing-title">Transforme seu estudo <span>em prática.</span></h1>
                <p className="landing-lead">Uma questão de cada vez, um passo a mais na sua preparação.</p>
                <p className="text-body-secondary mb-4">Explore provas reais, teste o que você aprendeu e use seus resultados para escolher o que revisar. No seu ritmo, de onde estiver.</p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                    <Link to="/criar-conta" className="btn btn-primary px-4 py-2">Criar minha conta grátis<i className="bi bi-arrow-right ms-2" aria-hidden="true"></i></Link>
                    <Link to="/questoes" className="btn btn-outline-secondary px-4 py-2">Explorar questões</Link>
                </div>
                <p className="small text-body-secondary mb-0"><i className="bi bi-unlock me-2" aria-hidden="true"></i>Consulte questões e provas sem login.</p>
            </div>
            <DemoQuestion />
        </section>

        <ul className="landing-highlights" aria-label="Recursos da plataforma">
            <li><i className="bi bi-journals" aria-hidden="true"></i>Questões de provas reais</li>
            <li><i className="bi bi-stopwatch" aria-hidden="true"></i>Simulados com cronômetro</li>
            <li><i className="bi bi-graph-up-arrow" aria-hidden="true"></i>Seu progresso em um só lugar</li>
        </ul>

        <section className="landing-section" aria-labelledby="landing-how-title">
            <div className="landing-section-heading">
                <p className="landing-kicker">Da primeira tentativa à próxima revisão</p>
                <h2 id="landing-how-title">Uma rotina de estudo que começa com um passo simples.</h2>
                <p className="text-body-secondary mb-0">Escolha um assunto, faça sua tentativa e descubra o que merece mais atenção.</p>
            </div>
            <ol className="landing-steps">
                {studySteps.map((step, index) => (
                    <li key={step.title}>
                        <div className="d-flex align-items-center justify-content-between mb-3"><span className="landing-step-number">0{index + 1}</span><i className={`bi ${step.icon} fs-4 text-app-primary`} aria-hidden="true"></i></div>
                        <h3 className="h5 mb-2">{step.title}</h3>
                        <p className="text-body-secondary mb-0">{step.text}</p>
                    </li>
                ))}
            </ol>
        </section>

        <section className="landing-section" aria-labelledby="landing-goals-title">
            <div className="landing-section-heading">
                <p className="landing-kicker">Seu objetivo, seu ritmo</p>
                <h2 id="landing-goals-title">Encontre um treino para a sua preparação.</h2>
                <p className="text-body-secondary mb-0">Explore o acervo livremente. Entre na sua conta quando quiser começar a responder.</p>
            </div>
            <div className="row g-3">
                {goals.map((goal) => (
                    <div key={goal.title} className="col-md-4">
                        <Link to={goal.to} className="landing-goal h-100">
                            <span className="client-icon-circle mb-4"><i className={`bi ${goal.icon} fs-5`} aria-hidden="true"></i></span>
                            <h3 className="h5 mb-2">{goal.title}</h3>
                            <p className="text-body-secondary mb-4">{goal.text}</p>
                            <span className="landing-goal-action mt-auto">{goal.action}<i className="bi bi-arrow-right" aria-hidden="true"></i></span>
                        </Link>
                    </div>
                ))}
            </div>
        </section>

        <section className="landing-progress-section" aria-labelledby="landing-sisu-title">
            <div>
                <p className="landing-kicker">Da prática ao planejamento</p>
                <h2 id="landing-sisu-title">Olhe também para o seu próximo passo no Sisu.</h2>
                <p className="text-body-secondary mb-0">Explore o histórico de notas de corte e simule sua média ponderada do ENEM. Duas ferramentas para organizar sua preparação, abertas para consulta sem login.</p>
            </div>
            <div className="landing-benefits">
                <div className="d-flex gap-3">
                    <span className="client-icon-circle flex-shrink-0"><i className="bi bi-mortarboard fs-5" aria-hidden="true"></i></span>
                    <div><h3 className="h6 mb-2">Conheça as notas de corte</h3><p className="small text-body-secondary mb-2">Pesquise por instituição e curso e compare os anos e as modalidades disponíveis na base.</p><Link to="/sisu/notas-de-corte" className="small fw-semibold">Consultar notas do Sisu<i className="bi bi-arrow-right ms-2" aria-hidden="true"></i></Link></div>
                </div>
                <div className="d-flex gap-3">
                    <span className="client-icon-circle flex-shrink-0"><i className="bi bi-calculator fs-5" aria-hidden="true"></i></span>
                    <div><h3 className="h6 mb-2">Simule sua média do ENEM</h3><p className="small text-body-secondary mb-2">Informe seus pesos ou utilize os valores cadastrados para cursos da UFU. O resultado é uma simulação de média ponderada.</p><Link to="/sisu/calculadora-enem" className="small fw-semibold">Abrir calculadora ENEM<i className="bi bi-arrow-right ms-2" aria-hidden="true"></i></Link></div>
                </div>
            </div>
        </section>

        <section className="landing-progress-section" aria-labelledby="landing-progress-title">
            <div>
                <p className="landing-kicker">Muito além de contar acertos</p>
                <h2 id="landing-progress-title">Saiba o que merece sua próxima revisão.</h2>
                <p className="text-body-secondary mb-4">Com uma conta, suas tentativas deixam de ficar soltas. Consulte o que já respondeu e use o histórico para planejar o próximo treino.</p>
                <Link to="/criar-conta" className="fw-semibold">Quero acompanhar meu progresso<i className="bi bi-arrow-right ms-2" aria-hidden="true"></i></Link>
            </div>
            <div className="landing-benefits">
                {benefits.map((benefit) => (
                    <div key={benefit.title} className="d-flex gap-3">
                        <span className="client-icon-circle flex-shrink-0"><i className={`bi ${benefit.icon} fs-5`} aria-hidden="true"></i></span>
                        <div><h3 className="h6 mb-1">{benefit.title}</h3><p className="small text-body-secondary mb-0">{benefit.text}</p></div>
                    </div>
                ))}
            </div>
        </section>

        <section className="landing-about" aria-labelledby="landing-about-title">
            <div>
                <p className="landing-kicker">Tecnologia a serviço do aprendizado</p>
                <h2 id="landing-about-title" className="h4">Um projeto do ecossistema SunSale System.</h2>
                <p className="text-body-secondary mb-2">O Questões Aqui é uma plataforma educacional feita para aproximar o conteúdo da prática, com organização, histórico e acompanhamento dos estudos.</p>
                <Link to="/sobre" className="small fw-semibold">Conheça o Questões Aqui<i className="bi bi-arrow-right ms-2" aria-hidden="true"></i></Link>
            </div>
        </section>

        <section className="landing-section landing-faq" aria-labelledby="landing-faq-title">
            <div className="landing-section-heading">
                <p className="landing-kicker">Antes de começar</p>
                <h2 id="landing-faq-title">Dúvidas que podem estar por aí.</h2>
            </div>
            {questions.map((question) => (
                <details key={question.title}>
                    <summary>{question.title}<i className="bi bi-chevron-down" aria-hidden="true"></i></summary>
                    <p className="text-body-secondary">{question.text}</p>
                </details>
            ))}
            <p className="small text-body-secondary mt-3 mb-0">Ficou com outra dúvida? <Link to="/contato">Fale com a gente.</Link></p>
        </section>

        <section className="landing-cta" aria-labelledby="landing-cta-title">
            <i className="bi bi-mortarboard fs-1 text-app-primary mb-3" aria-hidden="true"></i>
            <h2 id="landing-cta-title">Seu próximo treino pode começar agora.</h2>
            <p className="text-body-secondary mb-4">Crie sua conta para responder, revisar e acompanhar seu caminho.</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
                <Link to="/criar-conta" className="btn btn-primary px-4 py-2">Começar a praticar<i className="bi bi-arrow-right ms-2" aria-hidden="true"></i></Link>
                <Link to="/provas" className="btn btn-outline-secondary px-4 py-2">Ver provas disponíveis</Link>
            </div>
            <p className="small text-body-secondary mt-3 mb-0">Já tem uma conta? <Link to="/entrar">Entre por aqui.</Link></p>
        </section>
    </div>
);

export default LandingPage;
