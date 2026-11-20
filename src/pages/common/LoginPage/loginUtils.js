export const getLoginErrorMessage = (error) => (error?.response?.status === 403
    ? 'Seu usuário está desativado. Entre em contato com o administrador.'
    : 'Falha na autenticação. Verifique seus dados e tente novamente.');
