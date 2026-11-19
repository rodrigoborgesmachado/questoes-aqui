import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoading } from '../../../../services/redux/loadingSlice';
import simuladoApi from '../../../../services/apiServices/simuladoApi';
import questoesApi from '../../../../services/apiServices/questoesApi';
import ResultadoResumo, { ShareResultadoButton } from '../../../../components/client/ResultadoResumo/ResultadoResumo';
import { downloadFromLink, putDateOnPattern } from '../../../../utils/functions';
import { getPercentual, getSimuladoAnterior, parseRespostas } from '../../../../utils/simuladoResultado';

const SimuladoResultadoPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [simulado, setSimulado] = useState(null);
    const [totalQuestoes, setTotalQuestoes] = useState(0);
    const [anterior, setAnterior] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            dispatch(setLoading(true));
            try {
                const response = await simuladoApi.getById(id);
                if (response.success) {
                    setSimulado(response.object);
                } else {
                    toast.error('Simulado não encontrado.');
                }
            } catch {
                toast.error('Erro ao buscar o simulado.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItem();
    }, [id, dispatch]);

    useEffect(() => {
        if (!simulado) {
            return;
        }
        questoesApi.getPaginated({ page: 1, quantity: 1, codigoProva: simulado.codigoProva })
            .then((response) => setTotalQuestoes(response.success ? response.total || 0 : 0))
            .catch(() => {});
        simuladoApi.getPaginated({ page: 1, quantity: 50 })
            .then((response) => setAnterior(getSimuladoAnterior(response.object || [], simulado)))
            .catch(() => {});
    }, [simulado]);

    const downloadReport = async () => {
        dispatch(setLoading(true));
        try {
            const response = await simuladoApi.getReportDetail(id);
            if (response.success) {
                downloadFromLink(response.object, `Simulado ${id}.html`);
            } else {
                toast.error('Relatório não encontrado.');
            }
        } catch {
            toast.error('Erro ao gerar o relatório.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (!simulado) {
        return null;
    }

    const respostas = parseRespostas(simulado.respostas);
    const percentual = getPercentual(respostas);
    const diferenca = anterior ? percentual - getPercentual(parseRespostas(anterior.respostas)) : null;

    return (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
            <Link to="/simulados" className="link-secondary small d-inline-block mb-3">
                <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>Meus simulados
            </Link>
            <ResultadoResumo
                titulo={simulado.prova?.nomeProva}
                subtitulo={putDateOnPattern(simulado.created)}
                destaque={diferenca !== null && (
                    <>
                        <i className={`bi ${diferenca > 0 ? 'bi-arrow-up' : diferenca < 0 ? 'bi-arrow-down' : 'bi-dash'} me-1`} aria-hidden="true"></i>
                        {diferenca === 0 ? 'Mesmo resultado da última vez' : `${diferenca > 0 ? '+' : ''}${diferenca}% em relação à última vez`}
                    </>
                )}
                itens={respostas}
                puladasSemNumero={Math.max(totalQuestoes - respostas.length, 0)}
                totalQuestoes={totalQuestoes}
                tempo={simulado.tempo || 0}
            >
                <Link to={`/simulados/prova/${simulado.codigoProva}`} className="btn btn-primary">Refazer simulado</Link>
                <ShareResultadoButton percentual={percentual} nomeProva={simulado.prova?.nomeProva} codigoProva={simulado.codigoProva} />
                <button type="button" className="btn btn-outline-secondary" onClick={downloadReport}>
                    <i className="bi bi-download me-1" aria-hidden="true"></i>Baixar relatório
                </button>
            </ResultadoResumo>
        </div>
    );
};

export default SimuladoResultadoPage;
