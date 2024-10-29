import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";
import { createTweetMutateProps } from "../types";

const CREATE_TWEET = gql`
  mutation CreateTweet($payload: CreateTweetInput!) {
    createTweet(payload: $payload) {
      id
      content
      author {
        firstName
        lastName
        userName
        profileImgUrl
      }
    }
  }
`;

export const createTweetMutate = async (payload: createTweetMutateProps) => {
  const data = await graphqlClient.request(CREATE_TWEET, { payload });
  return data;
};
