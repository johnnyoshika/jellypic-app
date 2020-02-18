import gql from 'graphql-tag';
import { POST_FRAGMENT } from './fragments';

export const POSTS_ADDED = gql`
  subscription postsAdded {
    postsAdded {
      post {
        ...post
      }
    }
  }
  ${POST_FRAGMENT}
`;
