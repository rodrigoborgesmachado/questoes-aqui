// services/redux/store.jsx
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import the authentication slice
import loadingReducer from './loadingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
});

export default store;
