import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";

const REPOST_TWEET = gql`
  mutation RepostTweet($payload: repostTweetInput) {
    toggleRepostTweet(payload: $payload) {
      id
    }
  }
`;

const REPOST_COMMENT = gql`
  mutation RepostComment($payload: repostCommentInput) {
    toggleRepostComment(payload: $payload) {
      id
    }
  }
`;

export const repostCommentMutate = async (payload: { commentId: string }) => {
  console.log("repost commetn tjjl");
  console.log(payload, "payload");
  const data = await graphqlClient.request(REPOST_COMMENT, { payload });
  return data;
};

export const repostTweetMutate = async (payload: { tweetId: string }) => {
  const data = await graphqlClient.request(REPOST_TWEET, { payload });
  return data;
};
