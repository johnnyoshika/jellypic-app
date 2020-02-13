import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useSetMe } from 'context/user-context';
import { USER_FRAGMENT } from 'schema/fragments';
import Error from 'components/Error';
import Loading from 'components/Loading';

const GET_ME = gql`
  query getMe {
    user(id: "me") {
      ...user
    }
  }
  ${USER_FRAGMENT}
`;

const Session = () => {
  const { data, loading, error, refetch } = useQuery(GET_ME, {
    notifyOnNetworkStatusChange: true,
  });
  const setMe = useSetMe();

  const retry = () => refetch().catch(() => {}); // Unless we catch, a network error will cause an unhandled rejection: https://github.com/apollographql/apollo-client/issues/3963

  if (error)
    return (
      <Error error={error}>
        <div>
          <button className="btn btn-primary" onClick={retry}>
            Try again!
          </button>
        </div>
      </Error>
    );

  if (loading) return <Loading />;

  setMe(data.user);

  return <div>Almost ready...</div>;
};

export default Session;
