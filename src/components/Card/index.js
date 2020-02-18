import React from 'react';
import Comment from './Comment';
import AddComment from './AddComment';
import { Link } from 'react-router-dom';
import { Image } from 'cloudinary-react';
import Moment from 'react-moment';
import { useMe } from 'context/user-context';
import gql from 'graphql-tag';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import { POST_FRAGMENT } from 'schema/fragments';
import { toast } from 'react-toastify';

import './style.css';

const POST_UPDATED = gql`
  subscription postUpdated($id: ID!) {
    postUpdated(id: $id) {
      post {
        ...post
      }
    }
  }
  ${POST_FRAGMENT}
`;

const ADD_LIKE = gql`
  mutation addLike($input: AddLikeInput!) {
    addLike(input: $input) {
      post {
        ...post
      }
    }
  }
  ${POST_FRAGMENT}
`;

const REMOVE_LIKE = gql`
  mutation removeLike($input: RemoveLikeInput!) {
    removeLike(input: $input) {
      post {
        ...post
      }
    }
  }
  ${POST_FRAGMENT}
`;

const Card = ({ post }) => {
  const me = useMe();

  useSubscription(POST_UPDATED, {
    variables: {
      id: post.id,
    },
  });

  const [addLike] = useMutation(ADD_LIKE, {
    variables: {
      input: {
        postId: post.id,
      },
    },
    optimisticResponse: {
      addLike: {
        __typename: 'AddLikePayload',
        post: {
          __typename: 'Post',
          ...post,
          likes: [
            ...post.likes,
            {
              __typename: 'Like',
              id: '_' + Math.round(Math.random() * 1000000),
              createdAt: new Date(),
              user: me,
            },
          ],
        },
      },
    },
  });

  const [removeLike] = useMutation(REMOVE_LIKE, {
    variables: {
      input: {
        postId: post.id,
      },
    },
    optimisticResponse: {
      removeLike: {
        __typename: 'RemoveLikePayload',
        post: {
          __typename: 'Post',
          ...post,
          likes: post.likes.filter(l => l.user.id !== me.id),
        },
      },
    },
  });

  const likedByMe = () =>
    post.likes.some(like => like.user.id === me.id);

  const toggleLike = () =>
    (likedByMe() ? removeLike : addLike)().catch(error =>
      toast.error(error.message),
    );

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
          <Link to={'/posts/' + post.id}>
            <Moment
              format="MMM d, YYYY"
              fromNowDuring={1000 * 3600 * 24 * 30}
            >
              {post.createdAt}
            </Moment>
          </Link>
        </div>
      </div>
      <div className="card-photo">
        <Image
          className="image-100"
          crossOrigin="anonymous"
          cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
          publicId={post.cloudinaryPublicId}
          crop="fit"
          height="600"
          width="600"
          secure
        />
      </div>
      <div className="card-info">
        <div className="card-info-likes">
          {post.likes.length} likes
        </div>
        <div className="card-info-comments">
          {post.comments.map(comment => (
            <Comment key={comment.id} post={post} comment={comment} />
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
            <AddComment post={post} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
