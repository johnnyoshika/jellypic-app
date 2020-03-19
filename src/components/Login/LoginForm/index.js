import React, { useEffect, useState } from 'react';
import Error from 'components/Error';

import './style.css';

const LoginForm = ({ login, loading, error }) => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {}, []);

  const handleLoginClick = () => {};

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
        </div>
      </div>
      <div className="gutter" />
    </div>
  );
};

export default LoginForm;
