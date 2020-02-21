import React from 'react';
import InfinitePosts from 'components/InfinitePosts';
import Card from 'components/Card';
import Error from 'components/Error';
import Loading from 'components/Loading';

import './style.css';

const Home = () => {
  return (
    <InfinitePosts>
      {(posts, loading, error, retry) => (
        <div className="home-container">
          <div className="gutter" />
          <div className="home-main">
            {posts.nodes.map(post => (
              <Card key={post.id} post={post} />
            ))}
            {loading ? (
              <Loading />
            ) : (
              error && (
                <Error error={error}>
                  <button className="btn btn-primary" onClick={retry}>
                    Try again!
                  </button>
                </Error>
              )
            )}
          </div>
          <div className="gutter" />
        </div>
      )}
    </InfinitePosts>
  );
};

export default Home;
