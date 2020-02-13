import React from 'react';
import { Link } from 'react-router-dom';
import { useMe } from 'context/user-context';

const Comment = ({ postId, comment }) => {
  const me = useMe();
  const deleteComment = () => {};

  return (
    <div className="card-info-comment">
      <div className="card-info-comment-user pull-left">
        <Link to={'/users/' + comment.user.id}>
          {comment.user.username}
        </Link>
      </div>
      {me.id === comment.user.id && (
        <div className="pull-right">
          <button
            className="button-link"
            onClick={() => deleteComment()}
          >
            <i className="fa fa-times-circle" aria-hidden="true" />
          </button>
        </div>
      )}
      {comment.text}
    </div>
  );
};

export default Comment;
