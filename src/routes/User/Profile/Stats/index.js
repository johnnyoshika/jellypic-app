import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Error from 'components/Error';

export const GET_PROFILE = gql`
  query getProfile($id: ID!) {
    profile(id: $id) {
      id
      postCount
      likeCount
      commentCount
    }
  }
`;

const Stats = ({ id }) => {
  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    variables: {
      id,
    },
    notifyOnNetworkStatusChange: true,
  });

  const retry = () => refetch().catch(() => {}); // Unless we catch, a network error will cause an unhandled rejection: https://github.com/apollographql/apollo-client/issues/3963

  if (error)
    return (
      <Error error={error}>
        <button className="btn btn-primary" onClick={retry}>
          Try again!
        </button>
      </Error>
    );

  return (
    <div className="profile-info-social-stats">
      {loading ? null : (
        <>
          <div>
            <strong>{data.profile.postCount}</strong> posts
          </div>
          <div>
            <strong>{data.profile.likeCount}</strong> likes
          </div>
          <div>
            <strong>{data.profile.commentCount}</strong> comments
          </div>
        </>
      )}
    </div>
  );
};

export default Stats;
