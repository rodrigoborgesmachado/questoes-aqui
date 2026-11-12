import React from 'react';
import { buildQuestionHtml, getAnexoSource } from '../../../utils/questionHtml';
import ReportQuestion from '../ReportQuestion/ReportQuestion';
import './QuestionView.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const getOptionState = (codigo, selectedCode, correctCode) => {
    if (correctCode === codigo) return 'is-correct';
    if (selectedCode === codigo) return correctCode == null ? 'is-selected' : 'is-wrong';
    return '';
};

const QuestionView = ({ questao, selectedCode = null, correctCode = null, disabled = false, onSelect }) => (
    <article className="question-view">
        <div className="d-flex flex-wrap gap-2 mb-2">
            {questao.numeroQuestao > 0 && <span className="badge rounded-pill text-bg-secondary">Questão {questao.numeroQuestao}</span>}
            {questao.materia && <span className="badge rounded-pill question-badge">{questao.materia}</span>}
            {questao.assunto && <span className="badge rounded-pill bg-body-secondary text-body border">{questao.assunto}</span>}
        </div>
        {questao.prova && (
            <p className="small text-body-secondary mb-3">
                {questao.prova.nomeProva}{questao.prova.banca ? ` · ${questao.prova.banca}` : ''}
            </p>
        )}
        <div className="question-statement mb-4" dangerouslySetInnerHTML={{ __html: buildQuestionHtml(questao) }}></div>
        <div className="d-grid gap-2">
            {(questao.respostasQuestoes || []).map((resposta, index) => {
                const state = getOptionState(resposta.codigo, selectedCode, correctCode);
                return (
                    <button
                        key={resposta.codigo}
                        type="button"
                        className={`question-option ${state}`}
                        disabled={disabled}
                        onClick={() => onSelect?.(resposta)}
                    >
                        <span className="question-option-letter">{LETTERS[index]}</span>
                        {resposta.anexoResposta?.length > 0
                            ? <img src={getAnexoSource(resposta.anexoResposta[0])} alt={`Alternativa ${LETTERS[index]}`} className="question-option-image" />
                            : <span className="question-option-text" dangerouslySetInnerHTML={{ __html: resposta.textoResposta }}></span>}
                        {state === 'is-correct' && <i className="bi bi-check-circle-fill ms-auto" aria-label="Alternativa correta"></i>}
                        {state === 'is-wrong' && <i className="bi bi-x-circle-fill ms-auto" aria-label="Alternativa marcada incorreta"></i>}
                    </button>
                );
            })}
        </div>
        <ReportQuestion key={questao.codigo} questaoId={questao.codigo} />
    </article>
);

export default QuestionView;
