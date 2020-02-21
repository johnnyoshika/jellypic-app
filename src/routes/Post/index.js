import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_POST } from 'schema/queries';
import Card from 'components/Card';
import Error from 'components/Error';
import Preview from './Preview';

import './style.css';

const Post = ({
  match: {
    params: { id },
  },
}) => {
  const { data, loading, error, refetch } = useQuery(GET_POST, {
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
    <div className="post-container">
      <div className="gutter" />
      <div className="post-main">
        {loading ? (
          <Preview id={id} />
        ) : (
          <Card key={data.post.id} post={data.post} />
        )}
      </div>
      <div className="gutter" />
    </div>
  );
};

export default Post;
