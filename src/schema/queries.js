import gql from 'graphql-tag';
import { POST_FRAGMENT } from './fragments';

export const GET_POSTS = gql`
  query getPosts($after: Int) {
    posts(after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        ...post
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_POST = gql`
  query getPost($id: ID!) {
    post(id: $id) {
      ...post
    }
  }
  ${POST_FRAGMENT}
`;
