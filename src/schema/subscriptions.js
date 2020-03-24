import gql from 'graphql-tag';
import { POST_FRAGMENT } from './fragments';

export const POSTS_ADDED = gql`
  subscription postsAdded($userId: ID) {
    postsAdded(userId: $userId) {
      post {
        ...post
      }
    }
  }
  ${POST_FRAGMENT}
`;
