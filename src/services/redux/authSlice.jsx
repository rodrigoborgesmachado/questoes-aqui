import { createSlice } from '@reduxjs/toolkit';
import storageService from '../../services/storageService';
import Config from '../../config/storageConfiguration';

const token = storageService.getItem(Config.TOKEN);
const code = storageService.getItem(Config.CODE);
const name = storageService.getItem(Config.NAME);
const admin = storageService.getItem(Config.ADMIN);
const userView = storageService.getItem(Config.USER_VIEW);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    code: code || null,
    isAuthenticated: !!token,
    name: name || '',
    isAdmin: `${admin}` === '1',
    isUserView: `${userView}` === '1'
  },
  reducers: {
    login: (state, action) => {
      const { access_token, code, name, admin } = action.payload;
      state.token = access_token;
      state.code = code;
      state.isAuthenticated = true;
      state.name = name;
      state.isAdmin = `${admin}` === '1';
      state.isUserView = false;

      storageService.setItem(Config.TOKEN, access_token);
      storageService.setItem(Config.NAME, name);
      storageService.setItem(Config.CODE, code);
      storageService.setItem(Config.ADMIN, admin);
      storageService.removeItem(Config.USER_VIEW);
    },
    setUserView: (state, action) => {
      state.isUserView = action.payload;
      storageService.setItem(Config.USER_VIEW, action.payload ? '1' : '0');
    },
    setName: (state, action) => {
      state.name = action.payload;
      storageService.setItem(Config.NAME, action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.code = null;
      state.isAuthenticated = false;
      state.name = '';
      state.isAdmin = false;
      state.isUserView = false;
      Object.values(Config).forEach((key) => storageService.removeItem(key));
    },
  },
});

export const { login, logout, setName, setUserView } = authSlice.actions;
export const selectUserName = (state) => state.auth.name;
export const selectUserCode = (state) => state.auth.code;
export const isAuthenticated = (state) => state.auth.isAuthenticated;
export default authSlice.reducer;
