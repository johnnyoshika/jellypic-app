import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Login from 'components/Login';

const IS_LOGGED_IN = gql`
  query isUserLoggedIn {
    isLoggedIn @client
  }
`;

const AuthenticatedApp = () => {
  return <div>Authenticated</div>;
};

const App = () => {
  const { data } = useQuery(IS_LOGGED_IN);
  return data && data.isLoggedIn ? <AuthenticatedApp /> : <Login />;
};

export default App;
