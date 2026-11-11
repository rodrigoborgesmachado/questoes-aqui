import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles/index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './services/redux/store';
import { applyTheme, getStoredTheme } from './utils/themeMode';

applyTheme(getStoredTheme());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
