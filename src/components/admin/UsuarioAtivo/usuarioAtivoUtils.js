export const isActive = (item) => `${item?.isActive}` !== '0';

export const canUpdateActive = (item, userCode) => `${item?.Id}` !== `${userCode}`;

export const activeLabel = (item) => (isActive(item) ? 'Desativar usuário' : 'Ativar usuário');
