import { Link } from 'react-router-dom';
import './InstitutionalPage.css';

function TermosPage() {
    return (
        <article className='institutional-page'>
            <div className='card border-0 shadow-sm institutional-card'>
                <h1 className='institutional-title'>Termos de Uso</h1>

                <p className='institutional-paragraph'>
                    Estes Termos de Uso regulam o acesso e a utilização da plataforma Questões Aqui. Ao criar uma conta,
                    acessar ou utilizar qualquer funcionalidade do serviço, o usuário declara que leu, compreendeu e
                    concorda integralmente com as condições descritas abaixo.
                </p>
                <p className='institutional-paragraph'>
                    Caso não concorde com estes termos, recomenda-se que não utilize a plataforma.
                </p>

                <h2 className='institutional-section-title'>Objeto da plataforma</h2>
                <p className='institutional-paragraph'>
                    O Questões Aqui é uma plataforma digital destinada à prática de questões, organização de conteúdo e
                    acompanhamento de desempenho educacional. O serviço tem finalidade exclusivamente educacional e informativa.
                </p>
                <p className='institutional-paragraph'>
                    A utilização da plataforma não estabelece qualquer vínculo empregatício, societário ou de representação
                    entre o usuário e os responsáveis pelo projeto.
                </p>

                <h2 className='institutional-section-title'>Uso adequado da plataforma</h2>
                <p className='institutional-paragraph'>Ao utilizar o serviço, o usuário compromete-se a:</p>
                <ul className='institutional-list'>
                    <li>Fornecer informações verdadeiras, completas e atualizadas durante o cadastro.</li>
                    <li>Utilizar a plataforma exclusivamente para fins lícitos e educacionais.</li>
                    <li>Não praticar qualquer ato que comprometa a segurança, integridade ou disponibilidade do sistema.</li>
                    <li>Não tentar acessar áreas restritas ou explorar vulnerabilidades técnicas.</li>
                    <li>Não realizar engenharia reversa, cópia indevida ou extração automatizada de conteúdo.</li>
                </ul>
                <p className='institutional-paragraph'>
                    Qualquer uso considerado abusivo, fraudulento ou que viole estes termos poderá resultar na suspensão
                    ou encerramento da conta, sem prejuízo de eventuais medidas legais cabíveis.
                </p>

                <h2 className='institutional-section-title'>Conta e credenciais</h2>
                <p className='institutional-paragraph'>
                    O usuário é responsável pela guarda e confidencialidade de sua senha e demais credenciais de acesso.
                </p>
                <p className='institutional-paragraph'>
                    Todas as atividades realizadas a partir de sua conta serão consideradas de sua responsabilidade,
                    salvo comprovação de uso indevido por terceiros.
                </p>
                <p className='institutional-paragraph'>
                    O Questões Aqui poderá suspender ou encerrar contas que violem estes Termos de Uso ou apresentem
                    indícios de utilização indevida.
                </p>

                <h2 className='institutional-section-title'>Propriedade intelectual</h2>
                <p className='institutional-paragraph'>
                    A marca, identidade visual, estrutura técnica, código-fonte, layout, organização da base de dados e
                    demais elementos próprios da plataforma são protegidos pela legislação aplicável de propriedade intelectual.
                </p>
                <p className='institutional-paragraph'>
                    É proibida a reprodução, distribuição, modificação, comercialização ou qualquer forma de utilização não
                    autorizada do conteúdo ou da estrutura da plataforma, salvo quando expressamente permitido.
                </p>
                <p className='institutional-paragraph'>
                    Questões eventualmente disponibilizadas podem estar associadas a provas públicas ou bancas examinadoras,
                    sendo utilizadas para fins educacionais.
                </p>

                <h2 className='institutional-section-title'>Disponibilidade e manutenção</h2>
                <p className='institutional-paragraph'>
                    O Questões Aqui busca manter alta disponibilidade e estabilidade do serviço. No entanto, a plataforma
                    pode passar por atualizações, melhorias, correções ou manutenções programadas ou emergenciais.
                </p>
                <p className='institutional-paragraph'>
                    Não há garantia de funcionamento ininterrupto, livre de falhas ou totalmente isento de erros técnicos.
                </p>
                <p className='institutional-paragraph'>
                    O responsável técnico poderá realizar alterações na estrutura, funcionalidades ou organização da
                    plataforma a qualquer momento, visando sua evolução e aprimoramento.
                </p>

                <h2 className='institutional-section-title'>Limitação de responsabilidade</h2>
                <p className='institutional-paragraph'>
                    A plataforma é disponibilizada como ferramenta de apoio ao estudo e à prática de questões.
                </p>
                <p className='institutional-paragraph'>
                    Resultados em concursos públicos, exames, avaliações acadêmicas ou processos seletivos dependem de
                    múltiplos fatores externos, incluindo dedicação individual, metodologia de estudo e critérios das
                    instituições organizadoras.
                </p>
                <p className='institutional-paragraph'>
                    O Questões Aqui não garante aprovação ou desempenho específico em qualquer processo avaliativo.
                </p>

                <h2 className='institutional-section-title'>Suspensão e encerramento de acesso</h2>
                <p className='institutional-paragraph'>
                    O acesso à plataforma poderá ser suspenso ou encerrado, a critério do responsável, em casos de:
                </p>
                <ul className='institutional-list'>
                    <li>Violação destes Termos de Uso.</li>
                    <li>Prática de atos ilícitos.</li>
                    <li>Tentativas de comprometimento da segurança da plataforma.</li>
                    <li>Uso incompatível com a finalidade educacional do serviço.</li>
                </ul>

                <h2 className='institutional-section-title'>Alterações destes termos</h2>
                <p className='institutional-paragraph'>
                    Estes Termos de Uso podem ser modificados a qualquer momento para refletir melhorias no produto,
                    alterações legais ou ajustes operacionais.
                </p>
                <p className='institutional-paragraph'>
                    A versão vigente será sempre disponibilizada na plataforma. A continuidade de uso após a publicação
                    de alterações será considerada como aceitação dos novos termos.
                </p>

                <p className='institutional-paragraph'>Última atualização: 02/03/2026</p>

                <div className='institutional-cta'>
                    <Link className='btn btn-outline-primary' to='/privacidade'>Ver Política de Privacidade</Link>
                </div>
            </div>
        </article>
    );
}

export default TermosPage;

