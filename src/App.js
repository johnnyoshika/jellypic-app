import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useUser } from 'context/user-context';
import Loading from 'components/Loading';
import Login from 'components/Login';
import Session from 'components/Session';
import Dashboard from 'routes';

const IS_LOGGED_IN = gql`
  query isUserLoggedIn {
    isLoggedIn @client
  }
`;

const App = () => {
  const { data } = useQuery(IS_LOGGED_IN);
  const user = useUser();
  if (!data) return <Loading />;

  if (!data.isLoggedIn) return <Login />;

  return user ? <Dashboard /> : <Session />;
};

export default App;
