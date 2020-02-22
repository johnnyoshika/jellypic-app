import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loading from 'components/Loading';
import Error from 'components/Error';

const GET_SUBSCRIPTION = gql`
  query getSubscription($endpoint: String!) {
    subscription(endpoint: $endpoint) {
      id
      endpoint
      createdAt
    }
  }
`;

const Endpoint = ({ endpoint, setAvailable, unsubscribe }) => {
  const { data, loading, error, refetch } = useQuery(
    GET_SUBSCRIPTION,
    {
      variables: {
        endpoint,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const retry = () => refetch().catch(() => {}); // Unless we catch, a network error will cause an unhandled rejection: https://github.com/apollographql/apollo-client/issues/3963

  if (loading) return <Loading />;

  if (error)
    return (
      <Error error={error}>
        <button className="btn btn-primary" onClick={retry}>
          Try again!
        </button>
      </Error>
    );

  if (!data.subscription) {
    setAvailable();
    return null;
  } else
    return (
      <div className="subscriber-state-alert subscriber-state-alert-green mb-40">
        You are subscribed to push notifications!{' '}
        <i className="fa fa-check" aria-hidden="true" />
        <br />
        <br />
        <button className="btn btn-primary" onClick={unsubscribe}>
          Unsubscribe
        </button>
      </div>
    );
};

export default Endpoint;
