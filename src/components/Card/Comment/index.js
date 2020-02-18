import React from 'react';
import { Link } from 'react-router-dom';
import { useMe } from 'context/user-context';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { POST_FRAGMENT } from 'schema/fragments';
import { toast } from 'react-toastify';

const REMOVE_COMMENT = gql`
  mutation removeComment($input: RemoveCommentInput!) {
    removeComment(input: $input) {
      post {
        ...post
      }
    }
  }
  ${POST_FRAGMENT}
`;

const Comment = ({ post, comment }) => {
  const me = useMe();

  const [removeComment] = useMutation(REMOVE_COMMENT, {
    variables: {
      input: {
        id: comment.id,
      },
    },
    optimisticResponse: {
      removeComment: {
        __typename: 'RemoveCommentPayload',
        post: {
          __typename: 'Post',
          ...post,
          comments: post.comments.filter(c => c.id !== comment.id),
        },
      },
    },
  });

  const onRemoveClick = () =>
    removeComment().catch(error => toast.error(error.message));

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
            onClick={() => onRemoveClick()}
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
