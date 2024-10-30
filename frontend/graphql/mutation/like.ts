import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";
import { toggleLikeTweetProps } from "../types";

const TOGGLE_LIKETWEET = gql`
  mutation ToggleLikeTweet($payload: toggleLikeTweetInput!) {
    toggleLikeTweet(payload: $payload) {
      id
    }
  }
`;

export const toggleLikeTweet = async (payload: toggleLikeTweetProps) => {
  const data = await graphqlClient.request(TOGGLE_LIKETWEET, { payload });
  return data;
};
