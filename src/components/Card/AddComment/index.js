import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { POST_FRAGMENT } from 'schema/fragments';
import { useMe } from 'context/user-context';

const ADD_COMMENT = gql`
  mutation addComment($input: AddCommentInput!) {
    addComment(input: $input) {
      post {
        ...post
      }
    }
  }
  ${POST_FRAGMENT}
`;

const AddComment = ({ post }) => {
  const me = useMe();
  const [comment, setComment] = useState('');

  const [addComment] = useMutation(ADD_COMMENT, {
    variables: {
      input: {
        postId: post.id,
        text: comment,
      },
    },
    optimisticResponse: {
      addComment: {
        __typename: 'AddCommentPayload',
        post: {
          ...post,
          comments: [
            ...post.comments,
            {
              __typename: 'Comment',
              id: '_' + Math.round(Math.random() * 1000000),
              createdAt: new Date(),
              text: comment,
              user: me,
            },
          ],
        },
      },
    },
  });

  const onSubmit = e => {
    e.preventDefault();
    if (!comment) return;
    const previous = comment;
    setComment('');
    addComment().catch(error => {
      setComment(previous);
      toast.error(error.message);
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        className="card-info-add-comment-input"
        type="text"
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Add a comment..."
      />
    </form>
  );
};

export default AddComment;
