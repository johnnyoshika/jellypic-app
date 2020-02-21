import React from 'react';
import { Image } from 'cloudinary-react';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import Error from 'components/Error';
import Loading from 'components/Loading';
import { GET_POSTS } from 'schema/queries';
import { POSTS_ADDED } from 'schema/subscriptions';

const Posts = ({ id }) => {
  const {
    data,
    loading,
    error,
    refetch,
    fetchMore,
    subscribeToMore,
  } = useQuery(GET_POSTS, {
    variables: {
      userId: id,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [setFetching] = useInfiniteScroll({
    loadMore: () => loadMore(),
  });

  const posts = data ? data.posts : { nodes: [], pageInfo: {} };

  const retry = () => refetch().catch(() => {}); // Unless we catch, a network error will cause an unhandled rejection: https://github.com/apollographql/apollo-client/issues/3963

  subscribeToMore({
    document: POSTS_ADDED,
    variables: {
      userId: id,
    },
    updateQuery: (prev, { subscriptionData }) => {
      if (!prev || !subscriptionData.data) return prev;
      const postsAdded = subscriptionData.data.postsAdded;

      return {
        ...prev,
        posts: {
          ...prev.posts,
          nodes: [
            ...postsAdded
              .map(pa => pa.post)
              .filter(
                p => !prev.posts.nodes.map(n => n.id).includes(p.id),
              ),
            ...prev.posts.nodes,
          ],
        },
      };
    },
  });

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
    <>
      <div className="profile-photos">
        {posts.nodes.map(post => (
          <div key={post.id} className="profile-photo">
            <Link to={'/posts/' + post.id}>
              <Image
                className="image-100"
                crossOrigin="anonymous"
                cloudName={
                  process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
                }
                publicId={post.cloudinaryPublicId}
                crop="fill"
                height="293"
                width="293"
                gravity="auto:faces"
                secure
              />
            </Link>
          </div>
        ))}
      </div>
      {loading ? (
        <Loading />
      ) : (
        error && (
          <Error key="1" error={error}>
            <button className="btn btn-primary" onClick={retry}>
              Try again!
            </button>
          </Error>
        )
      )}
    </>
  );
};

export default Posts;
