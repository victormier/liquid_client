export const DEVELOPMENT_CLIENT_HOST = 'localhost:8080';
export const STAGING_CLIENT_HOST = 'liquid-client-staging.herokuapp.com';
export const PRODUCTION_CLIENT_HOST_HEROKU = 'liquid-client.herokuapp.com';
export const PRODUCTION_CLIENT_HOST = 'app.helloliquid.com';

export const API_HOST_DEVELOPMENT = 'localhost:3000';
export const API_HOST_STAGING = 'liquid-api-staging.herokuapp.com';
export const API_HOST_PRODUCTION = 'api.helloliquid.com';

let liquidEnvironment;
if (process.env.NODE_ENV === 'production') {
  if ((window.location.hostname.toLowerCase().search(PRODUCTION_CLIENT_HOST) >= 0) ||
     (window.location.hostname.toLowerCase().search(PRODUCTION_CLIENT_HOST_HEROKU) >= 0)) {
    liquidEnvironment = 'production';
  } else {
    liquidEnvironment = 'staging';
  }
} else {
  liquidEnvironment = 'development';
}

let apiHost;
let mixpanelToken;
switch (liquidEnvironment) {
  case 'development':
    apiHost = `http://${API_HOST_DEVELOPMENT}`;
    mixpanelToken = '8031cf315d6b0b92f22892fe2ee70685';
    break;
  case 'staging':
    apiHost = `https://${API_HOST_STAGING}`;
    mixpanelToken = 'a7c4b21b8d0d7499f56ba532eaeb5e4c';
    break;
  default:
    apiHost = `https://${API_HOST_PRODUCTION}`;
    mixpanelToken = 'dc1a320436debda6a29ea4e58c5fb631';
}
export const API_URL = apiHost;
export const MIXPANEL_TOKEN = mixpanelToken;
