import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../../services/redux/loadingSlice';
import respostasavaliacoesApi from '../../../../services/apiServices/respostasavaliacoesApi';
import QuestionView from '../../../../components/client/QuestionView/QuestionView';
import StatCard from '../../../../components/client/StatCard/StatCard';
import { buildResultadoAvaliacao, getAvaliacaoAlunoUrl } from '../../../../utils/avaliacaoAluno';

const AvaliacaoResultadoPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const chave = searchParams.get('chave') || undefined;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [avaliacao, setAvaliacao] = useState(null);
    const [respostas, setRespostas] = useState([]);

    useEffect(() => {
        const fetchResultado = async () => {
            dispatch(setLoading(true));
            try {
                const minhasRespostas = await respostasavaliacoesApi.getMinhasRespostas(id);
                if (!minhasRespostas.success || !minhasRespostas.object?.length) {
                    navigate(getAvaliacaoAlunoUrl(id, chave), { replace: true });
                    return;
                }
                const response = await respostasavaliacoesApi.getAvaliacaoAluno(id, chave);
                if (response.success) {
                    setRespostas(minhasRespostas.object);
                    setAvaliacao(response.object);
                } else {
                    toast.error('Avaliação não encontrada.');
                }
            } catch {
                toast.error('Erro ao buscar o resultado.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchResultado();
    }, [id, chave, dispatch, navigate]);

    if (!avaliacao) {
        return null;
    }

    const resultado = buildResultadoAvaliacao(avaliacao.questoesAvaliacao, respostas);

    return (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
            <section className="client-hero p-4 p-md-5 mb-4 shadow-sm text-center">
                <span className="text-hero-muted small">{avaliacao.nome}</span>
                <h1 className="display-4 fw-semibold my-2">{resultado.nota} / {resultado.notaTotal}</h1>
                <p className="lead text-hero-muted mb-0">nota obtida{avaliacao.usuario?.nome ? ` · Prof. ${avaliacao.usuario.nome}` : ''}</p>
            </section>

            <div className="row g-3 mb-4">
                <div className="col-sm-4">
                    <StatCard icon="bi-list-check" label="Respondidas" value={`${resultado.respondidas} de ${resultado.itens.length}`} />
                </div>
                <div className="col-sm-4">
                    <StatCard icon="bi-check2-circle" label="Acertos" value={resultado.acertos} />
                </div>
                <div className="col-sm-4">
                    <StatCard icon="bi-x-circle" label="Erros" value={resultado.respondidas - resultado.acertos} />
                </div>
            </div>

            {resultado.itens.map((item) => (
                <div key={item.questaoAvaliacao.idQuestao} className="card border-0 shadow-sm mb-3">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-end mb-2">
                            <span className={`badge ${item.idResposta == null ? 'text-bg-secondary' : item.certa ? 'text-bg-success' : 'text-bg-danger'}`}>
                                {item.idResposta == null ? 'Não respondida' : item.certa ? 'Certa' : 'Errada'}
                            </span>
                        </div>
                        <QuestionView questao={item.questaoAvaliacao.questao} selectedCode={item.idResposta} correctCode={item.idCorreta} disabled />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AvaliacaoResultadoPage;
