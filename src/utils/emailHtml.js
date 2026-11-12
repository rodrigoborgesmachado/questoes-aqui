export const hiddenLinkLabel = '[link oculto]';

export const hideEmailLinks = (html) => (html || '')
    .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/(?:https?:\/\/|www\.)[^\s"'<>]+/gi, hiddenLinkLabel);
