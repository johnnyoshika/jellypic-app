import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import Error from 'components/Error';
import Loading from 'components/Loading';
import { GET_POSTS } from 'schema/queries';
import Card from 'components/Card';

import './style.css';

const Home = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_POSTS, {
    notifyOnNetworkStatusChange: true,
  });

  const [setFetching] = useInfiniteScroll({
    loadMore: () => loadMore(),
  });

  const posts = data ? data.posts : { nodes: [], pageInfo: {} };

  const loadMore = () => {
    if (!posts.pageInfo.hasNextPage) return;

    fetchMore({
      variables: {
        after: posts.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => ({
        ...previousResult,
        posts: {
          ...previousResult.posts,
          pageInfo: {
            ...previousResult.posts.pageInfo,
            endCursor: fetchMoreResult.posts.pageInfo.endCursor,
            hasNextPage: fetchMoreResult.posts.pageInfo.hasNextPage,
          },
          nodes: [
            ...previousResult.posts.nodes,
            ...fetchMoreResult.posts.nodes,
          ],
        },
      }),
    })
      .catch(() => {}) // Unless we catch, a network error will cause an unhandled rejection: https://github.com/apollographql/apollo-client/issues/3963;
      .finally(() => {
        setFetching(false);
      });
  };

  return (
    <div className="home-container">
      <div className="gutter" />
      <div className="home-main">
        {posts.nodes.map(post => (
          <Card key={post.id} post={post} />
        ))}
        {loading ? (
          <Loading />
        ) : (
          error && <Error key="1" error={error}></Error>
        )}
      </div>
      <div className="gutter" />
    </div>
  );
};

export default Home;
