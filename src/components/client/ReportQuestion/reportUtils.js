export const MAX_REPORT_DESCRIPTION = 1000;

export const REPORT_MOTIVOS = [
    { value: 'gabarito', label: 'Gabarito errado' },
    { value: 'enunciado', label: 'Enunciado incompleto ou errado' },
    { value: 'imagem', label: 'Imagem quebrada' },
    { value: 'anulada', label: 'Questão anulada' },
    { value: 'outro', label: 'Outro' },
];

export const REPORT_STATUS = [
    { value: 'aberto', label: 'Aberto', className: 'text-bg-warning' },
    { value: 'resolvido', label: 'Resolvido', className: 'text-bg-success' },
    { value: 'descartado', label: 'Descartado', className: 'text-bg-secondary' },
];

export const getMotivoLabel = (motivo) => REPORT_MOTIVOS.find((item) => item.value === motivo)?.label ?? motivo;

export const getStatus = (status) => REPORT_STATUS.find((item) => item.value === status) ?? { value: status, label: status, className: 'text-bg-light' };

export const validateReport = ({ motivo = '', descricao = '' } = {}) => {
    const value = descricao.trim();
    if (!REPORT_MOTIVOS.some((item) => item.value === motivo)) return 'Selecione o motivo do problema.';
    if (motivo === 'outro' && !value) return 'Descreva o problema encontrado.';
    if (value.length > MAX_REPORT_DESCRIPTION) return `A descrição deve ter no máximo ${MAX_REPORT_DESCRIPTION} caracteres.`;
    return null;
};

export const countMotivos = (reportes = []) => REPORT_MOTIVOS
    .map((item) => ({ ...item, quantidade: reportes.filter((reporte) => reporte.motivo === item.value).length }))
    .filter((item) => item.quantidade > 0);

export const getOpenCodes = (reportes = []) => reportes.filter((reporte) => reporte.status === 'aberto').map((reporte) => reporte.codigo);
