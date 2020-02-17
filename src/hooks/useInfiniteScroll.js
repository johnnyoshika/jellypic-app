import { useEffect, useState, useCallback } from 'react';

const useInfiniteScroll = ({ loadMore }) => {
  const [fetching, setFetching] = useState(false);

  const onScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY <
      document.body.offsetHeight - 500
    )
      return;

    setFetching(true);
  }, [setFetching]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, false);
    return () =>
      window.removeEventListener('scroll', onScroll, false);
  }, [onScroll]);

  useEffect(() => {
    if (fetching) loadMore();
    // disbable lint: https://github.com/facebook/react/issues/15865#issuecomment-530276309
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching]);

  return [setFetching];
};

export default useInfiniteScroll;
