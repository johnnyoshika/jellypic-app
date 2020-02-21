import { useQuery } from '@apollo/react-hooks';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import { GET_POSTS } from 'schema/queries';
import { POSTS_ADDED } from 'schema/subscriptions';

const InfinitePosts = ({ children, userId }) => {
  const {
    data,
    loading,
    error,
    refetch,
    fetchMore,
    subscribeToMore,
  } = useQuery(GET_POSTS, {
    variables: {
      userId: userId,
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
      userId: userId,
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

  return children(posts, loading, error, retry);
};

export default InfinitePosts;
