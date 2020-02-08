import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import LoginForm from './LoginForm';

const LOGIN_USER = gql`
  mutation login($accessToken: String!) {
    login(input: { accessToken: $accessToken }) {
      me {
        id
      }
    }
  }
`;

const Login = () => {
  const client = useApolloClient();
  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted({ login }) {
      client
        .resetStore()
        .then(() => client.writeData({ data: { isLoggedIn: true } }));
    },
  });

  return <LoginForm login={login} loading={loading} error={error} />;
};

export default Login;
