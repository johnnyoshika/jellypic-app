import React from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { GET_POST } from 'schema/queries';
import { POST_FRAGMENT } from 'schema/fragments';
import Card from 'components/Card';
import Loading from 'components/Loading';
import Error from 'components/Error';

import './style.css';

const RENDER_STATE = {
  preview: 'preview',
  data: 'data',
  loading: 'loading',
  error: 'error',
};

const Post = ({
  match: {
    params: { id },
  },
}) => {
  const client = useApolloClient();
  const preview = client.readFragment({
    id: `Post:${id}`,
    fragment: POST_FRAGMENT,
    fragmentName: 'post',
  });

  const { data, error, refetch } = useQuery(GET_POST, {
    variables: {
      id,
    },
    notifyOnNetworkStatusChange: true,
  });

  const retry = () => refetch().catch(() => {}); // Unless we catch, a network error will cause an unhandled rejection: https://github.com/apollographql/apollo-client/issues/3963

  const state = data
    ? RENDER_STATE.data
    : preview
    ? RENDER_STATE.preview
    : error
    ? RENDER_STATE.error
    : RENDER_STATE.loading;

  return (
    <div className="post-container">
      <div className="gutter" />
      <div className="post-main">
        {
          {
            data: <Card post={data && data.post} />,
            preview: <Card post={preview} />,
            error: (
              <Error error={error}>
                <button className="btn btn-primary" onClick={retry}>
                  Try again!
                </button>
              </Error>
            ),
            loading: <Loading />,
          }[state]
        }
      </div>
      <div className="gutter" />
    </div>
  );
};

export default Post;
