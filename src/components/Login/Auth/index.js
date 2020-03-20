import auth0 from 'auth0-js';

const auth = new auth0.WebAuth({
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo`,
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
  responseType: 'id_token',
  scope: 'openid profile',
});

const checkSession = () => {
  return new Promise((resolve, reject) => {
    auth.checkSession({}, (err, authResult) => {
      // clean up Auth0's redirect hash
      if (window.location.hash)
        window.history.replaceState(
          '',
          document.title,
          window.location.pathname + window.location.search,
        );

      if (err) return reject(err);
      if (!authResult || !authResult.idToken)
        return reject({ description: 'Error loggin in' });

      resolve(authResult);
    });
  });
};

const signIn = () => auth.authorize();

const signOut = () =>
  auth.logout({
    returnTo: process.env.REACT_APP_AUTH0_REDIRECT_URI,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  });

export { signIn, signOut, checkSession };
