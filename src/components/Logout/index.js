import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import useAuth0 from 'hooks/useAuth0';
import { CachePersistor } from 'apollo-cache-persist';

const Logout = () => {
  const client = useApolloClient();
  const { signOut } = useAuth0();
  const persistor = new CachePersistor({
    cache: client.cache,
    storage: window.localStorage,
  });

  const handleClick = e => {
    e.preventDefault();
    client.clearStore().then(() => {
      localStorage.removeItem('auth-token');

      // We need to purge persistor after clearing the cache store, otherwise our localStorage 'apollo-cache-persist' will be left as {} by clearStore(),
      // which is an invalid state: https://github.com/apollographql/apollo-cache-persist/issues/126#issuecomment-602725578
      // Apollo 3.x will fix this: https://github.com/apollographql/apollo-cache-persist/issues/126#issuecomment-602723222
      persistor
        .purge()
        .catch(() => {
          // Wipe out 'apollo-cache-persist' from localStorage as a last resort
          localStorage.removeItem('apollo-cache-persist');
        })
        .finally(() => {
          client.writeData({ data: { isLoggedIn: false } });
          signOut();
        });
    });
  };

  return (
    <a href="/" onClick={handleClick}>
      <i className="fa fa-sign-out"></i>
    </a>
  );
};

export default Logout;
