export const stringToHash = (text) => {
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i);
        hash = hash & hash;
    }

    return hash;
};
