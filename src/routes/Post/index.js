import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_POST } from 'schema/queries';
import Card from 'components/Card';
import Error from 'components/Error';
import Loading from 'components/Loading';

import './style.css';

const Post = ({
  match: {
    params: { id },
  },
}) => {
  const { data, loading, error } = useQuery(GET_POST, {
    variables: {
      id,
    },
  });

  if (error) return <Error error={error} />;

  if (loading && !data) return <Loading />;

  const { post } = data;
  return (
    <div className="post-container">
      <div className="gutter" />
      <div className="post-main">
        <Card key={post.id} post={post} />
      </div>
      <div className="gutter" />
    </div>
  );
};

export default Post;
