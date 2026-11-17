export const hiddenLinkLabel = '[link oculto]';

export const hideEmailLinks = (html) => (html || '')
    .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/(?:https?:\/\/|www\.)[^\s"'<>]+/gi, hiddenLinkLabel);

export const emailFileName = (assunto, dataEnvio) => `${[assunto || 'Email', dataEnvio].filter(Boolean).join(' - ')}.html`
    .replace(/[/\\:*?"<>|]/g, '-');
