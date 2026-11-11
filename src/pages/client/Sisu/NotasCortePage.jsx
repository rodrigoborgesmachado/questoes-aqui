import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import sisuApi from '../../../services/apiServices/sisuApi';
import useSisuList from './useSisuList';
import SisuSelect from './SisuSelect';
import { formatScore, groupCutoffs } from './sisuUtils';
import './Sisu.css';

const NotasCortePage = () => {
    const [institution, setInstitution] = useState('');
    const [course, setCourse] = useState('');
    const [query, setQuery] = useState(null);
    const institutions = useSisuList(sisuApi.getInstituicoes);
    const courses = useSisuList(sisuApi.getCursos, institution || null);
    const notes = useSisuList(sisuApi.getNotas, query);
    const { years, groups } = useMemo(() => groupCutoffs(notes.data), [notes.data]);

    const changeInstitution = (value) => {
        setInstitution(value);
        setCourse('');
        setQuery(null);
    };

    const changeCourse = (value) => {
        setCourse(value);
        setQuery(null);
    };

    const search = (event) => {
        event.preventDefault();
        if (institution && course) {
            setQuery({ instituicao: institution, curso: course });
        }
    };

    return (
        <div className="sisu-page">
            <header className="d-flex flex-wrap align-items-end justify-content-between gap-3">
                <div className="sisu-page-heading">
                    <p className="small text-app-primary fw-semibold mb-2"><i className="bi bi-mortarboard me-2" aria-hidden="true"></i>Sisu · Planeje sua preparação</p>
                    <h1 className="h3 mb-2">Notas de corte do Sisu</h1>
                    <p className="text-body-secondary mb-0">Consulte o histórico disponível por instituição, curso e modalidade de concorrência. Não é preciso entrar na conta.</p>
                </div>
                <Link to="/sisu/calculadora-enem" className="btn btn-outline-primary"><i className="bi bi-calculator me-2" aria-hidden="true"></i>Calculadora ENEM</Link>
            </header>

            <form className="card border-0 shadow-sm" onSubmit={search}>
                <div className="card-body p-4">
                    <h2 className="h5 mb-3">Encontre as notas do seu curso</h2>
                    <div className="row g-3 align-items-end">
                        <div className="col-lg-5"><SisuSelect id="sisu-institution" label="Instituição" resource={institutions} value={institution} onChange={changeInstitution} placeholder="Selecione uma instituição" /></div>
                        <div className="col-lg-5"><SisuSelect key={institution} id="sisu-course" label="Curso" resource={courses} value={course} onChange={changeCourse} placeholder={institution ? 'Selecione um curso' : 'Escolha a instituição primeiro'} /></div>
                        <div className="col-lg-2"><button type="submit" className="btn btn-primary w-100" disabled={!institution || !course || notes.status === 'loading'}>Consultar notas</button></div>
                    </div>
                </div>
            </form>

            <p className="small text-body-secondary mb-0"><i className="bi bi-info-circle me-2" aria-hidden="true"></i>As notas são referências históricas da base consultada. Os valores podem mudar a cada edição e não garantem classificação. Confira as regras e os resultados oficiais da seleção desejada.</p>

            {notes.status === 'idle' && (
                <div className="card border-0 shadow-sm sisu-empty">
                    <i className="bi bi-search fs-1 text-app-primary mb-3" aria-hidden="true"></i>
                    <h2 className="h5">Comece pela instituição e pelo curso</h2>
                    <p className="text-body-secondary mb-0">Depois da consulta, você verá os anos disponíveis e as notas de cada modalidade de concorrência.</p>
                </div>
            )}
            {notes.status === 'loading' && <div className="card border-0 shadow-sm sisu-empty" role="status"><span className="spinner-border text-app-primary mx-auto mb-3" aria-hidden="true"></span>Consultando notas de corte...</div>}
            {notes.status === 'error' && <div className="alert alert-warning mb-0" role="alert">Não foi possível consultar as notas. <button type="button" className="btn btn-link p-0" onClick={notes.retry}>Tentar novamente</button></div>}
            {notes.status === 'ready' && groups.length === 0 && <div className="card border-0 shadow-sm sisu-empty"><h2 className="h5">Nenhuma nota encontrada</h2><p className="text-body-secondary mb-0">Não há registros para esta seleção na base consultada. Escolha outro curso ou instituição.</p></div>}

            {notes.status === 'ready' && groups.map((group, index) => (
                <section key={group.key} className="card border-0 shadow-sm" aria-labelledby={`sisu-result-${index}`}>
                    <div className="card-body p-4">
                        <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-2">
                            <h2 id={`sisu-result-${index}`} className="h5 mb-0">{group.nomeCurso || 'Curso consultado'}</h2>
                            {group.numeroEdicao && <span className="badge question-badge">Edição {group.numeroEdicao}</span>}
                        </div>
                        <p className="mb-1">{group.nomeInstituicao}{group.siglaInstituicao && ` (${group.siglaInstituicao})`}</p>
                        <p className="small text-body-secondary mb-0">{[group.nomeCampus, group.nomeMunicipioCampus, group.ufCampus, group.turno, group.descricaoGrau].filter(Boolean).join(' · ')}</p>
                    </div>
                    <p className="small text-body-secondary d-md-none px-4 mb-2"><i className="bi bi-arrow-left-right me-2" aria-hidden="true"></i>Deslize a tabela para ver todos os anos.</p>
                    <div className="table-responsive" tabIndex="0" role="region" aria-label={`Notas por ano de ${group.nomeCurso || 'curso consultado'}`}>
                        <table className="table align-middle sisu-cutoff-table" style={{ '--sisu-year-count': years.length }}>
                            <caption className="visually-hidden">Notas de corte por modalidade e ano. Um traço indica ausência de registro.</caption>
                            <colgroup><col className="sisu-mode-column" /><col span={years.length} /></colgroup>
                            <thead><tr><th scope="col" className="ps-4">Modalidade de concorrência</th>{years.map((year) => <th key={year} scope="col">{year}</th>)}</tr></thead>
                            <tbody>
                                {group.rows.map((row) => (
                                    <tr key={row.key}>
                                        <th scope="row" className="ps-4"><strong className="d-block">{row.mode || 'Modalidade'}</strong><span className="small text-body-secondary">{row.description || 'Descrição não informada'}</span></th>
                                        {years.map((year) => <td key={year}>{row.byYear.has(year) ? row.byYear.get(year).map((record, recordIndex) => <span key={record.id ?? recordIndex} className="d-block">{formatScore(record.notaCorte)}</span>) : '—'}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="small text-body-secondary px-4 py-3 mb-0">“—” indica que não há nota registrada. Valores iguais a zero são exibidos como 0,00. Campus, turnos e edições diferentes aparecem em tabelas separadas.</p>
                </section>
            ))}
        </div>
    );
};

export default NotasCortePage;
