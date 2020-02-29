import React from 'react';
import { useHistory } from 'react-router-dom';
import loadScript from 'utils/loadScript';
import { toast } from 'react-toastify';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { POST_FRAGMENT } from 'schema/fragments';

const ADD_POSTS = gql`
  mutation addPosts($posts: [AddPostInput!]!) {
    addPosts(inputs: $posts) {
      post {
        ...post
      }
    }
  }
  ${POST_FRAGMENT}
`;

const Uploader = ({ children, setUploadState, setUploadError }) => {
  const history = useHistory();
  const [addPosts] = useMutation(ADD_POSTS, {
    onError: error => {
      setUploadError(error.message);
      setUploadState('error');
    },
    onCompleted: data => {
      setUploadState('idle');
      setUploadError(null);
    },
  });

  const handleClick = () => {
    loadScript('//widget.cloudinary.com/global/all.js').then(
      () => showUploader(),
      () => {
        toast.error(`Can't connect to network. Please try again!`);
      },
    );
  };

  const showUploader = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        upload_preset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
        sources: [
          'local',
          'url',
          'camera',
          'facebook',
          'google_photos',
        ],
        tags: ['dashboard'],
        theme: 'white',
        multiple: false,
      },
      (error, result) => {
        if (!error) {
          setUploadError(null);
          setUploadState('saving');
          addPosts({
            variables: {
              posts: result.map(image => ({
                cloudinaryPublicId: image.public_id,
              })),
            },
          });
          history.push('/');
          return;
        }

        if (error.message !== 'User closed widget')
          toast.error(error.message);
      },
    );
  };

  return (
    <button className="button-link" onClick={handleClick}>
      {children}
    </button>
  );
};

export default Uploader;
