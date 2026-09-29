export const SSO_API_URL = (
  process.env.REACT_APP_OSM_URL || "https://api-dev.tdei.us/api/v1"
).replace(/\/$/, "");

export const SSO_CLIENT_ID =
  process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "";

export const SSO_LOGIN_CALLBACK_PATH = "/callback";
export const SSO_LOGOUT_CALLBACK_PATH = "/logout/callback";

export function getSsoLoginCallbackUri() {
  return `${window.location.origin}${SSO_LOGIN_CALLBACK_PATH}`;
}

export function getSsoLogoutCallbackUri() {
  return `${window.location.origin}${SSO_LOGOUT_CALLBACK_PATH}`;
}
