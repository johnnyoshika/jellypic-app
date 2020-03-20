import React, { useEffect, useState, useCallback } from 'react';
import { signIn, checkSession } from '../Auth';
import Error from 'components/Error';

import './style.css';

const LoginForm = ({ login, loading, error }) => {
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);
  const [checking, setChecking] = useState(true);

  const memoizedCallback = useCallback(
    token => {
      login({
        variables: {
          token,
        },
      }).catch(() => setChecking(false)); // Unless we catch, a network error will cause an unhandled rejection: https://github.com/apollographql/apollo-client/issues/3963
    },
    [login],
  );

  useEffect(() => {
    checkSession().then(
      authResult => {
        memoizedCallback(authResult.idToken);
      },
      err => {
        if (err.code === 'login_required') signIn();
        else {
          setLoginErrorMessage(err.description);
          setChecking(false);
        }
      },
    );
  }, [memoizedCallback]);

  const handleLoginClick = () => {
    setChecking(true);
    signIn();
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
            onClick={() => handleLoginClick()}
          >
            Log in
          </button>
          {error && <Error error={error} />}
          {loginErrorMessage && <Error error={loginErrorMessage} />}
        </div>
      </div>
      <div className="gutter" />
    </div>
  );
};

export default LoginForm;
