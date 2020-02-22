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

export const COMMENT_FRAGMENT = gql`
  fragment comment on Comment {
    id
    text
    createdAt
    user {
      ...user
    }
  }
  ${USER_FRAGMENT}
`;

export const LIKE_FRAGMENT = gql`
  fragment like on Like {
    id
    createdAt
    user {
      ...user
    }
  }
  ${USER_FRAGMENT}
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
      ...comment
    }
    likes {
      ...like
    }
  }
  ${USER_FRAGMENT}
  ${COMMENT_FRAGMENT}
  ${LIKE_FRAGMENT}
`;

export const SUBSCRIPTION_FRAGMENT = gql`
  fragment subscription on Subscription {
    id
    createdAt
    endpoint
  }
`;
