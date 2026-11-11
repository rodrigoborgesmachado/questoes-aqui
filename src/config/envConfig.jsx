import ConfigService from "../services/configService";

const EnvConfig = {
    DEVELOPMENT: {
      API_URL: ConfigService.getApiUrl(),
    },
    PRODUCTION: {
      API_URL: "https://apisunsale.azurewebsites.net/api",
    }
};

const getCurrentEnvConfig = () => {
    return import.meta.env.PROD
      ? EnvConfig.PRODUCTION.API_URL
      : EnvConfig.DEVELOPMENT.API_URL;
};

export default getCurrentEnvConfig;
