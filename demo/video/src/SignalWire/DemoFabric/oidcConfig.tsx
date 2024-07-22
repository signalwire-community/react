import { User, WebStorageStateStore } from "oidc-client-ts";

let {
  VITE_FABRIC_CLIENT_ID,
  VITE_FABRIC_ISSUER,
  VITE_FABRIC_AUTH_ENDPOINT,
  VITE_FABRIC_TOKEN_ENDPOINT,
  VITE_FABRIC_REDIRECT_URI,
} = import.meta.env;

const oidc_config = {
  authority: "x", // dummy authority
  metadata: {
    issuer: VITE_FABRIC_ISSUER,
    authorization_endpoint: VITE_FABRIC_AUTH_ENDPOINT,
    token_endpoint: VITE_FABRIC_TOKEN_ENDPOINT,
  },
  client_id: VITE_FABRIC_CLIENT_ID,
  redirect_uri: VITE_FABRIC_REDIRECT_URI,
  response_type: "code",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: (_user: User | void): void => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

export default oidc_config;
