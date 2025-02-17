import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";

const TOGGLE_LIKETWEET = gql`
  mutation ToggleLikeTweet($payload: toggleLikeTweetInput!) {
    toggleLikeTweet(payload: $payload) {
      id
    }
  }
`;
const TOGGLE_LIKECOMMENT = gql`
  mutation toggleLikeComment($payload: toggleLikeCommentInput!) {
    toggleLikeComment(payload: $payload) {
      id
    }
  }
`;

export const toggleLikeTweet = async (payload: { tweetId: string }) => {
  const data = await graphqlClient.request(TOGGLE_LIKETWEET, { payload });
  return data;
};

export const toggleLikeComment = async (payload: { commentId: string }) => {
  const data = await graphqlClient.request(TOGGLE_LIKECOMMENT, { payload });
  return data;
};
