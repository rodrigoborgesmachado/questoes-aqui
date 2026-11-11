export const maskCPF = (value) => {
    return value?.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const maskCNPJ = (value) => {
    return value?.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

export const maskCEP = (value) => {
    return value?.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
};

export const maskPhone = (phone) => {
    return phone?.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4})$/, '$1-$2').slice(0, 15);
};
