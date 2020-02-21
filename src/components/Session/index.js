import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useSetMe } from 'context/user-context';
import { GET_USER } from 'schema/queries';
import Error from 'components/Error';
import Loading from 'components/Loading';

const Session = () => {
  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: {
      id: 'me',
    },
    notifyOnNetworkStatusChange: true,
  });
  const setMe = useSetMe();

  const retry = () => refetch().catch(() => {}); // Unless we catch, a network error will cause an unhandled rejection: https://github.com/apollographql/apollo-client/issues/3963

  if (error)
    return (
      <Error error={error}>
        <button className="btn btn-primary" onClick={retry}>
          Try again!
        </button>
      </Error>
    );

  if (loading) return <Loading />;

  setMe(data.user);

  return <div>Almost ready...</div>;
};

export default Session;
