import { useEffect, useState } from 'react';

const useInfiniteScroll = ({ loadMore }) => {
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, false);
    return () =>
      window.removeEventListener('scroll', onScroll, false);
  }, []);

  useEffect(() => {
    if (fetching) loadMore();
  }, [fetching]);

  const onScroll = () => {
    if (
      window.innerHeight + window.scrollY <
      document.body.offsetHeight - 500
    )
      return;

    setFetching(true);
  };

  return [setFetching];
};

export default useInfiniteScroll;
