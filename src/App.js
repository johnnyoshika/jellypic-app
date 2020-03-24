import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast } from 'react-toastify';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useMe } from 'context/user-context';
import Login from 'components/Login';
import Session from 'components/Session';
import Dashboard from 'routes';

import 'react-toastify/dist/ReactToastify.min.css';

toast.configure({
  autoClose: 6000,
});

const IS_LOGGED_IN = gql`
  query isUserLoggedIn {
    isLoggedIn @client
  }
`;

const App = () => {
  const { data } = useQuery(IS_LOGGED_IN);
  const me = useMe();

  return (
    <Router>
      {!data || !data.isLoggedIn ? (
        <Login />
      ) : me ? (
        <Dashboard />
      ) : (
        <Session />
      )}
    </Router>
  );
};

export default App;
