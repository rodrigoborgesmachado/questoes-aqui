import React from 'react';
import { Link } from 'react-router-dom';

const currentYear = new Date().getFullYear();

const ClientFooter = () => (
    <footer className="client-footer border-top bg-body">
        <div className="container-xl py-4 py-lg-5">
            <div className="row g-4">
                <div className="col-lg-6">
                    <Link to="/" className="d-inline-flex align-items-center gap-2 fw-semibold fs-5 text-decoration-none mb-2">
                        <i className="bi bi-mortarboard-fill" aria-hidden="true"></i>Questões Aqui
                    </Link>
                    <p className="small text-body-secondary mb-0 client-footer-description">Uma questão de cada vez, um passo a mais na sua preparação. Um produto educacional da SunSale System.</p>
                </div>
                <nav className="col-6 col-lg-3" aria-label="Recursos de estudo">
                    <h2 className="h6 mb-3">Para estudar</h2>
                    <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
                        <li><Link to="/questoes" className="link-secondary">Banco de questões</Link></li>
                        <li><Link to="/provas" className="link-secondary">Provas anteriores</Link></li>
                        <li><Link to="/sisu/notas-de-corte" className="link-secondary">Notas de corte do Sisu</Link></li>
                        <li><Link to="/sisu/calculadora-enem" className="link-secondary">Calculadora ENEM</Link></li>
                    </ul>
                </nav>
                <nav className="col-6 col-lg-3" aria-label="Links institucionais">
                    <h2 className="h6 mb-3">A plataforma</h2>
                    <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
                        <li><Link to="/sobre" className="link-secondary">Sobre</Link></li>
                        <li><Link to="/privacidade" className="link-secondary">Privacidade</Link></li>
                        <li><Link to="/termos" className="link-secondary">Termos</Link></li>
                        <li><Link to="/contato" className="link-secondary">Contato</Link></li>
                        <li><a href="https://www.tabuadadivertida.com/?utm_source=questoesaqui&utm_medium=footer" target="_blank" rel="noopener noreferrer" className="link-secondary">Tabuada Divertida<i className="bi bi-arrow-up-right ms-2" aria-hidden="true"></i></a></li>
                    </ul>
                </nav>
            </div>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-top mt-4 pt-4 small text-body-secondary">
                <span>© {currentYear} SunSale System. Todos os direitos reservados.</span>
                <a href="https://www.sunsalesystem.com.br/" target="_blank" rel="noopener noreferrer" className="link-secondary">Conheça a SunSale System<i className="bi bi-arrow-up-right ms-2" aria-hidden="true"></i></a>
            </div>
        </div>
    </footer>
);

export default ClientFooter;
