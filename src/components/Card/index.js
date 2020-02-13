import React from 'react';
import Comment from './Comment';
import AddComment from './AddComment';
import { Link } from 'react-router-dom';

import './style.css';
import { useMe } from 'context/user-context';

const Card = ({ post }) => {
  const me = useMe();

  const likedByMe = () =>
    post.likes.some(like => like.user.id === me.id);

  const toggleLike = () => {};

  return (
    <div className="card">
      <div className="card-heading">
        <div className="card-heading-user">
          <div className="card-heading-user-image">
            <img
              src={post.user.thumbUrl}
              alt={post.user.username}
              crossOrigin="anonymous"
            />
          </div>
          <div className="card-heading-user-name">
            <Link to={'/users/' + post.user.id}>
              {post.user.username}
            </Link>
          </div>
        </div>
        <div className="card-heading-time text-right">
          <Link to={'/posts/' + post.id}>{post.createdAt}</Link>
        </div>
      </div>
      <div className="card-photo">
        <div className="text-center">{post.cloudinaryPublicId}</div>
      </div>
      <div className="card-info">
        <div className="card-info-likes">
          {post.likes.length} likes
        </div>
        <div className="card-info-comments">
          {post.comments.map(comment => (
            <Comment
              key={comment.id}
              postId={post.id}
              comment={comment}
            />
          ))}
        </div>
        <div className="card-info-add-comment">
          <div>
            <button className="button-link" onClick={toggleLike}>
              <i
                className={
                  'fa fa-heart fa-2x' +
                  (likedByMe() ? ' red-icon' : '')
                }
                aria-hidden="true"
              />
            </button>
          </div>
          <div>
            <AddComment postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
