import axios from "axios";
import getCurrentEnvConfig from "../../config/envConfig";
import Config from "../../config/storageConfiguration";
import storageService from "../storageService";

const apiUrl = getCurrentEnvConfig();

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = () => {
  return storageService.getItem(Config["TOKEN"]);
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isTokenRequest = error.config?.url?.includes("/Token");

    if (error.response?.status === 401 && !isTokenRequest && getToken()) {
      Object.values(Config).forEach((key) => storageService.removeItem(key));
      window.dispatchEvent(new Event("unauthorized"));
    }

    return Promise.reject(error);
  }
);

window.addEventListener("unauthorized", () => {
  window.location.href = "/entrar?reason=session-expired";
});

export default api;
