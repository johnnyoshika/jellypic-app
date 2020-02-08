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
