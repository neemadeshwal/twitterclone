import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";

const TOGGLE_BOOKMARK_TWEET = gql`
  mutation ToggleBookmarkTweet($payload: toggleSaveTweetInput) {
    toggleSaveTweet(payload: $payload) {
      tweet {
        id
        content
      }

      msg
    }
  }
`;
const TOGGLE_BOOKMARK_COMMENT = gql`
  mutation ToggleBookmarkComment($payload: saveUnsaveCommentInput) {
    toggleSaveComment(payload: $payload) {
      comment {
        id
        content
      }
      msg
    }
  }
`;

export const toggleBookmarkTweet = async (payload: { tweetId: string }) => {
  const data = await graphqlClient.request(TOGGLE_BOOKMARK_TWEET, { payload });
  return data;
};

export const toggleBookmarkComment = async (payload: { commentId: string }) => {
  const data = await graphqlClient.request(TOGGLE_BOOKMARK_COMMENT, {
    payload,
  });
  return data;
};
