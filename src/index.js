import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { UserProvider } from 'context/user-context';

import { typeDefs, resolvers } from 'schema/resolvers';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const cache = new InMemoryCache();
cache.writeData({
  data: {
    isLoggedIn: true, // presume logged in
  },
});

const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_API_ORIGIN}/graphql`,
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions && err.extensions.code === 'authorization') {
        cache.writeData({
          data: {
            isLoggedIn: false,
          },
        });
      } else if (err.extensions)
        console.log(`${err.extensions.code} error`);
      else console.log(`graphQLErrors: ${graphQLErrors}`);
    }
  }

  if (networkError) console.log('networkError', networkError);
});

const link = ApolloLink.from([errorLink, httpLink]);

const client = new ApolloClient({
  link,
  cache,
  typeDefs,
  resolvers,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <UserProvider>
      <App />
    </UserProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
