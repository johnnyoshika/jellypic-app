import React, { useEffect, useState } from 'react';
import Error from 'components/Error';

import './style.css';

const ensureFacebookSdkLoaded = callback => {
  if (window.fbAsyncInit) return callback();

  window.fbAsyncInit = () => {
    window.FB.init({
      appId: process.env.REACT_APP_FACEBOOK_APP_ID,
      cookie: false,
      xfbml: false,
      version: 'v6.0',
    });
    callback();
  };

  (function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
};

const LoginForm = ({ login, loading, error }) => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    ensureFacebookSdkLoaded(() => {
      window.FB.getLoginStatus(response => {
        if (response.status === 'connected')
          login({
            variables: {
              accessToken: response.authResponse.accessToken,
            },
          });
        else setChecking(false);
      });
    });
  }, [login]);

  const loginWithFacebook = () => {
    window.FB.login(response => {
      if (response.status === 'connected')
        login({
          variables: {
            accessToken: response.authResponse.accessToken,
          },
        });
    });
  };

  return (
    <div className="login-container">
      <div className="gutter" />
      <div className="login-main">
        <div className="font-lobster text-center mb-40">Jellypic</div>
        <div className="text-center">
          <button
            className="btn btn-primary btn-lg"
            disabled={checking || loading}
            onClick={() => loginWithFacebook()}
          >
            Log in with Facebook
          </button>
          {error && <Error error={error} />}
        </div>
      </div>
      <div className="gutter" />
    </div>
  );
};

export default LoginForm;
