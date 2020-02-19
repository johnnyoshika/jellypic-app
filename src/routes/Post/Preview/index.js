import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { POST_FRAGMENT } from 'schema/fragments';
import Card from 'components/Card';
import Loading from 'components/Loading';

const Preview = ({ id }) => {
  const client = useApolloClient();
  const post = client.readFragment({
    id: `Post:${id}`,
    fragment: POST_FRAGMENT,
    fragmentName: 'post',
  });

  return post ? <Card key={post.id} post={post} /> : <Loading />;
};

export default Preview;
