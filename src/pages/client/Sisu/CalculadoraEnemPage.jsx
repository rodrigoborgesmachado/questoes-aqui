import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sisuApi from '../../../services/apiServices/sisuApi';
import useSisuList from './useSisuList';
import SisuSelect from './SisuSelect';
import { calculateWeightedAverage, enemAreas, formatScore, parseDecimal } from './sisuUtils';
import './Sisu.css';

const CalculadoraEnemPage = () => {
    const [mode, setMode] = useState('manual');
    const [course, setCourse] = useState('');
    const [manualWeights, setManualWeights] = useState(() => enemAreas.map(() => '1'));
    const [scores, setScores] = useState({});
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const courses = useSisuList(sisuApi.getCursosComPesos);
    const weights = useSisuList(sisuApi.getPesos, mode === 'ufu' ? course || null : null);
    const rows = (mode === 'manual'
        ? enemAreas.map((name, index) => ({ name, weight: manualWeights[index] }))
        : weights.data.map((item) => ({ name: item.materia, weight: parseDecimal(item.peso) ?? '' })))
        .map((row, index) => {
            const key = `${mode}:${mode === 'ufu' ? course : ''}:${row.name}:${index}`;
            return { ...row, key, score: scores[key] ?? '' };
        });

    const clearResult = () => { setResult(null); setError(''); };
    const changeMode = (value) => { setMode(value); clearResult(); };
    const changeCourse = (value) => { setCourse(value); clearResult(); };
    const changeScore = (key, value) => { setScores((previous) => ({ ...previous, [key]: value })); clearResult(); };
    const changeWeight = (index, value) => {
        setManualWeights((previous) => previous.map((weight, rowIndex) => rowIndex === index ? value : weight));
        clearResult();
    };

    const calculate = (event) => {
        event.preventDefault();
        try {
            setResult(calculateWeightedAverage(rows));
            setError('');
        } catch (calculationError) {
            setResult(null);
            setError(calculationError.message);
        }
    };

    return (
        <div className="sisu-page">
            <header className="d-flex flex-wrap align-items-end justify-content-between gap-3">
                <div className="sisu-page-heading">
                    <p className="small text-app-primary fw-semibold mb-2"><i className="bi bi-calculator me-2" aria-hidden="true"></i>Sisu · Planeje sua preparação</p>
                    <h1 className="h3 mb-2">Calculadora de média do ENEM</h1>
                    <p className="text-body-secondary mb-0">Informe suas notas e os pesos de cada área para simular a média ponderada. O cálculo é feito aqui, sem precisar de login.</p>
                </div>
                <Link to="/sisu/notas-de-corte" className="btn btn-outline-primary">Consultar notas de corte<i className="bi bi-arrow-right ms-2" aria-hidden="true"></i></Link>
            </header>

            <div className="row g-4">
                <div className="col-lg-8">
                    <form className="card border-0 shadow-sm" onSubmit={calculate}>
                        <div className="card-body p-4">
                            <fieldset className="mb-4">
                                <legend className="h5 mb-3">Como deseja definir os pesos?</legend>
                                <div className="d-flex flex-wrap gap-3">
                                    <div className="form-check"><input id="enem-manual" name="enem-mode" type="radio" className="form-check-input" checked={mode === 'manual'} onChange={() => changeMode('manual')} /><label htmlFor="enem-manual" className="form-check-label">Informar manualmente</label></div>
                                    <div className="form-check"><input id="enem-ufu" name="enem-mode" type="radio" className="form-check-input" checked={mode === 'ufu'} onChange={() => changeMode('ufu')} /><label htmlFor="enem-ufu" className="form-check-label">Usar pesos cadastrados da UFU</label></div>
                                </div>
                            </fieldset>

                            {mode === 'ufu' ? (
                                <div className="mb-4">
                                    <SisuSelect id="enem-course" label="Curso da UFU" resource={courses} value={course} onChange={changeCourse} placeholder="Selecione um curso" />
                                    <p className="small text-body-secondary mt-2 mb-0">Pesos da base utilizada pelo projeto anterior. Confira o termo de adesão da edição pretendida antes de usar esses valores como referência.</p>
                                </div>
                            ) : <p className="small text-body-secondary mb-4">Use peso 1 em todas as áreas para obter a média simples. Peso 0 desconsidera a área no cálculo.</p>}

                            {mode === 'ufu' && weights.status === 'idle' && <p className="text-body-secondary py-3">Escolha um curso para carregar os pesos.</p>}
                            {mode === 'ufu' && weights.status === 'loading' && <p className="text-body-secondary py-3" role="status"><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Carregando os pesos...</p>}
                            {mode === 'ufu' && weights.status === 'error' && <div className="alert alert-warning" role="alert">Não foi possível carregar os pesos. <button type="button" className="btn btn-link p-0" onClick={weights.retry}>Tentar novamente</button>. Você também pode informar os pesos manualmente.</div>}
                            {mode === 'ufu' && weights.status === 'ready' && rows.length === 0 && <p className="text-body-secondary py-3">Não há pesos cadastrados para este curso. Use o modo manual para continuar.</p>}

                            {rows.map((row, index) => (
                                <div key={row.key} className="row g-3 align-items-end sisu-calculator-row">
                                    <div className="col-md-6"><h2 className="h6 mb-1">{row.name}</h2></div>
                                    <div className="col-6 col-md-3">
                                        <label htmlFor={`enem-weight-${index}`} className="form-label small">Peso</label>
                                        <input id={`enem-weight-${index}`} aria-label={`Peso de ${row.name}`} type="number" min="0" step="any" className="form-control" value={row.weight} readOnly={mode === 'ufu'} required onChange={(event) => changeWeight(index, event.target.value)} />
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <label htmlFor={`enem-score-${index}`} className="form-label small">Nota</label>
                                        <input id={`enem-score-${index}`} aria-label={`Nota de ${row.name}`} type="number" min="0" max="1000" step="any" className="form-control" value={row.score} required={parseDecimal(row.weight) !== 0} disabled={parseDecimal(row.weight) === 0} onChange={(event) => changeScore(row.key, event.target.value)} />
                                    </div>
                                </div>
                            ))}
                            {error && <div className="alert alert-danger mt-4 mb-0" role="alert">{error}</div>}
                            <div className="d-flex flex-wrap gap-2 mt-4">
                                <button type="submit" className="btn btn-primary" disabled={rows.length === 0 || (mode === 'ufu' && weights.status !== 'ready')}>Calcular média</button>
                                <button type="button" className="btn btn-outline-secondary" onClick={() => { setScores({}); clearResult(); }}>Limpar notas</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="col-lg-4">
                    <aside className="card border-0 shadow-sm sisu-calculator-summary" aria-labelledby="enem-result-title">
                        <div className="card-body p-4">
                            <span className="client-icon-circle mb-3"><i className="bi bi-calculator fs-5" aria-hidden="true"></i></span>
                            <h2 id="enem-result-title" className="h5">Sua média simulada</h2>
                            <div role="status" aria-live="polite" aria-atomic="true">
                                <output className="sisu-average my-3" aria-label="Média ponderada">{result ? formatScore(result.average) : '—'}</output>
                                <p className="small text-body-secondary">{result ? `Soma dos pesos: ${formatScore(result.totalWeight)}.` : 'Preencha as notas e clique em Calcular média para ver o resultado.'}</p>
                            </div>
                            <hr />
                            <h3 className="h6 mt-4">Como o cálculo funciona</h3>
                            <code className="sisu-formula my-3">Σ (nota × peso) ÷ Σ pesos</code>
                            <p className="small text-body-secondary">Cada nota é multiplicada pelo peso da área. A soma desses produtos é dividida pela soma dos pesos.</p>
                            <p className="small text-body-secondary mb-0">Esta ferramenta calcula a média das notas informadas. Não calcula a TRI, não substitui os critérios da instituição e não prevê aprovação.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CalculadoraEnemPage;
