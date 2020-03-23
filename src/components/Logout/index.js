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
      persistor.purge().then(
        () => signOut(),
        () => {
          // Wipe out 'apollo-cache-persist' as a last resort b/c clearStore assigns {} to 'apollo-cache-persist' localStorage
          // and leave our cache in a unusable state: https://github.com/apollographql/apollo-cache-persist/issues/126#issuecomment-602725578
          // Apollo 3.x will fix this: https://github.com/apollographql/apollo-cache-persist/issues/126#issuecomment-602723222
          localStorage.removeItem('apollo-cache-persist');
          signOut();
        },
      );
    });
  };

  return (
    <a href="/" onClick={handleClick}>
      <i className="fa fa-sign-out"></i>
    </a>
  );
};

export default Logout;
