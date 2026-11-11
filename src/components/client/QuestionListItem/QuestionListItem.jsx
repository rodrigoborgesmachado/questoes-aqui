import React from 'react';
import { Link } from 'react-router-dom';
import { getQuestionSummary } from '../../../utils/questionHtml';

const QuestionListItem = ({ questao, answerUrl }) => (
    <div className="card border-0 shadow-sm">
        <div className="card-body">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                {questao.numeroQuestao > 0 && <span className="badge rounded-pill text-bg-secondary">Questão {questao.numeroQuestao}</span>}
                {questao.materia && <span className="badge rounded-pill question-badge">{questao.materia}</span>}
                {questao.assunto && <span className="small text-body-secondary">{questao.assunto}</span>}
            </div>
            <p className="mb-3">{getQuestionSummary(questao.campoQuestao) || 'Questão com imagem.'}</p>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <span className="small text-body-secondary">{questao.prova?.nomeProva}</span>
                <div className="d-flex gap-2">
                    <Link to={`/questoes/${questao.Id}`} className="btn btn-outline-secondary btn-sm">Ver</Link>
                    <Link to={answerUrl} className="btn btn-primary btn-sm">Responder</Link>
                </div>
            </div>
        </div>
    </div>
);

export default QuestionListItem;
