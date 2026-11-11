import React from 'react';
import { Link } from 'react-router-dom';
import './InstitutionalPage.css';

const contacts = [
    { icon: 'bi-envelope', label: 'E-mail', text: 'rodrigomachado@sunsalesystem.com', href: 'mailto:rodrigomachado@sunsalesystem.com' },
    { icon: 'bi-whatsapp', label: 'WhatsApp', text: 'Falar com Rodrigo Machado', href: 'https://wa.me/5534999798100' },
    { icon: 'bi-globe2', label: 'SunSale System', text: 'Conheça nossos projetos', href: 'https://www.sunsalesystem.com.br/' },
    { icon: 'bi-linkedin', label: 'LinkedIn', text: 'SunSale System no LinkedIn', href: 'https://www.linkedin.com/company/sunsale-system/' },
    { icon: 'bi-github', label: 'GitHub', text: 'Projetos de Rodrigo Machado', href: 'https://github.com/rodrigoborgesmachado' },
];

const ContatoPage = () => (
    <article className="institutional-page">
        <div className="card border-0 shadow-sm institutional-card">
            <h1 className="institutional-title">Contato</h1>
            <p className="institutional-paragraph">Tem uma dúvida, uma sugestão ou encontrou algum problema? Entre em contato com a SunSale System pelos canais abaixo.</p>
            <div className="my-4">
                <h2 className="h5 mb-1">Rodrigo Machado</h2>
                <p className="small text-body-secondary mb-0">SunSale System · Questões Aqui</p>
            </div>
            <div className="d-flex flex-column gap-3">
                {contacts.map((contact) => (
                    <a key={contact.href} href={contact.href} className="contact-link" {...(contact.href.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        <i className={`bi ${contact.icon} fs-4 text-app-primary flex-shrink-0`} aria-hidden="true"></i>
                        <span><strong className="d-block">{contact.label}</strong><span className="small text-body-secondary">{contact.text}</span></span>
                    </a>
                ))}
            </div>
            <div className="institutional-cta"><Link to="/sobre" className="btn btn-outline-primary">Sobre o Questões Aqui</Link></div>
        </div>
    </article>
);

export default ContatoPage;
