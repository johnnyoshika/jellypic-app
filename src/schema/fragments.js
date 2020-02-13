import gql from 'graphql-tag';

export const USER_FRAGMENT = gql`
  fragment user on User {
    id
    username
    firstName
    lastName
    thumbUrl
    pictureUrl
  }
`;

export const POST_FRAGMENT = gql`
  fragment post on Post {
    id
    createdAt
    cloudinaryPublicId
    user {
      ...user
    }
    comments {
      id
      text
      createdAt
      user {
        ...user
      }
    }
    likes {
      id
      createdAt
      user {
        ...user
      }
    }
  }
  ${USER_FRAGMENT}
`;
