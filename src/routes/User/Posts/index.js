import React from 'react';
import InfinitePosts from 'components/InfinitePosts';
import { Image } from 'cloudinary-react';
import { Link } from 'react-router-dom';
import Error from 'components/Error';
import Loading from 'components/Loading';

const Posts = ({ id }) => {
  return (
    <InfinitePosts userId={id}>
      {(posts, loading, error, retry) => (
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
              <Error error={error}>
                <button className="btn btn-primary" onClick={retry}>
                  Try again!
                </button>
              </Error>
            )
          )}
        </>
      )}
    </InfinitePosts>
  );
};

export default Posts;
