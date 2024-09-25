// Global variable to hold the callback function that will be executed when the token expires.
let tokenExpiredCallback = null;


// Function to be called when the token expires.
export const onTokenExpired = () => {
//if a callback function has been set via `setTokenExpiredCallback`.
  if (tokenExpiredCallback) {
    tokenExpiredCallback(); 
  }
};
/**
 * Function to register a callback that will be triggered when the token expires.
 * @param {Function} callback - The callback function to be executed when the token expires.
 */
export const setTokenExpiredCallback = (callback) => {
  tokenExpiredCallback = callback; 
};
