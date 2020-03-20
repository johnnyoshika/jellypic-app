import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { useSetMe } from 'context/user-context';
import gql from 'graphql-tag';
import { USER_FRAGMENT } from 'schema/fragments';
import LoginForm from './LoginForm';

const LOGIN_USER = gql`
  mutation login($token: String!) {
    login(input: { token: $token }) {
      me {
        ...user
      }
    }
  }
  ${USER_FRAGMENT}
`;

const Login = () => {
  const client = useApolloClient();
  const setMe = useSetMe();
  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted({ login }) {
      setMe(login.me);
      client
        .resetStore()
        .then(() => client.writeData({ data: { isLoggedIn: true } }));
    },
  });

  return <LoginForm login={login} loading={loading} error={error} />;
};

export default Login;
