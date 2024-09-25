
let tokenExpiredCallback = null;

export const onTokenExpired = () => {
  if (tokenExpiredCallback) {
    tokenExpiredCallback();
  }
};

export const setTokenExpiredCallback = (callback) => {
  tokenExpiredCallback = callback;
};
