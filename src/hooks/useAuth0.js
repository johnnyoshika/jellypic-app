import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import auth0 from 'auth0-js';

const auth = new auth0.WebAuth({
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo`,
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
  responseType: 'id_token',
  scope: 'openid profile',
});

const signIn = () =>
  auth.authorize({
    state: window.location.pathname,
  });

const signOut = () =>
  auth.logout({
    returnTo: process.env.REACT_APP_AUTH0_REDIRECT_URI,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  });

const useAuth0 = () => {
  const history = useHistory();
  const checkSession = useCallback(() => {
    // clean up Auth0's redirect hash
    if (window.location.hash) {
      auth.parseHash(
        { hash: window.location.hash },
        (err, authResult) => {
          if (authResult.state !== window.location.pathname)
            history.replace(authResult.state);
          else
            window.history.replaceState(
              '',
              document.title,
              window.location.pathname + window.location.search,
            );
        },
      );
    }

    return new Promise((resolve, reject) => {
      auth.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken)
          return reject({ description: 'Error loggin in' });

        resolve(authResult);
      });
    });
  }, [history]);

  return { checkSession, signIn, signOut };
};

export default useAuth0;
