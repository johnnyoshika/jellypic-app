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
  const { data, loading, error } = useQuery(GET_POST, {
    variables: {
      id,
    },
  });

  if (error) return <Error error={error} />;

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
