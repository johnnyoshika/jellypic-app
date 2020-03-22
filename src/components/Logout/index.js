import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import useAuth0 from 'hooks/useAuth0';

const Logout = () => {
  const client = useApolloClient();
  const { signOut } = useAuth0();

  const handleClick = e => {
    e.preventDefault();
    client.clearStore().then(() => {
      localStorage.removeItem('auth-token');
      signOut();
    });
  };

  return (
    <a href="/" onClick={handleClick}>
      <i className="fa fa-sign-out"></i>
    </a>
  );
};

export default Logout;
