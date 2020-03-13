import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { RetryLink } from 'apollo-link-retry';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { getMainDefinition } from 'apollo-utilities';

import { UserProvider } from 'context/user-context';

import { typeDefs, resolvers } from 'schema/resolvers';

import './index.css';
import App from './App';

const cache = new InMemoryCache();
cache.writeData({
  data: {
    isLoggedIn: true, // presume logged in
  },
});

const waitOnCache = persistCache({
  cache,
  storage: window.localStorage,
});

const retryLink = new RetryLink({
  attempts: {
    max: 5,
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

const httpWithErrorLink = ApolloLink.from([
  retryLink,
  errorLink,
  httpLink,
]);

const wsLink = new WebSocketLink({
  uri: `${process.env.REACT_APP_WS_ORIGIN}/graphql`,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // route here for subscription operations
  httpWithErrorLink, // route here for everything else (e.g. query and mutation)
);

const client = new ApolloClient({
  link,
  cache,
  typeDefs,
  resolvers,
});

waitOnCache.then(() => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <UserProvider>
        <App />
      </UserProvider>
    </ApolloProvider>,
    document.getElementById('root'),
  );
});

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
}
