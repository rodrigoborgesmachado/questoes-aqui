import api from './serviceApi';
import { stringToHash } from '../../utils/passwordHash';

const SYSTEM_TYPE = 'QuestoesAqui';

const tokenApi = {
    getToken: async ({ userName, password }) => {
        const response = await api.post('/Token', { username: userName, password: `${stringToHash(password)}` });
        return response.data;
    },

    recoverPass: async (email) => {
        const response = await api.post('/recuperasenha/recovery-pass', null, { params: { email, tipo: SYSTEM_TYPE } });
        return response.data;
    },

    resetPass: async (guid, password) => {
        const response = await api.post('/recuperasenha/reset-pass', null, { params: { guid, pass: stringToHash(password), tipo: SYSTEM_TYPE } });
        return response.data;
    },
};

export default tokenApi;
