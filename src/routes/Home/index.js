import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Error from 'components/Error';
import Loading from 'components/Loading';
import { GET_POSTS } from 'schema/queries';
import Card from 'components/Card';

import './style.css';

const Home = () => {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (error) return <Error error={error}></Error>;

  if (loading && !data) return <Loading />;

  return (
    <div className="home-container">
      <div className="gutter" />
      <div className="home-main">
        {data.posts.nodes.map(post => (
          <Card key={post.id} post={post} />
        ))}
      </div>
      <div className="gutter" />
    </div>
  );
};

export default Home;
