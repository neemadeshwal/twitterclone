import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";
import { createTweetMutateProps } from "../types";

const CREATE_TWEET = gql`
  mutation CreateTweet($payload: CreateTweetInput!) {
    createTweet(payload: $payload) {
      id
      content
      mediaArray
      author {
        firstName
        lastName
        userName
        profileImgUrl
      }
    }
  }
`;

const DELETE_TWEET = gql`
  mutation deleteTweet($payload: DeleteTweetInput!) {
    deleteTweet(payload: $payload) {
      id
    }
  }
`;

const EDIT_TWEET=gql`
 mutation EditTweet($payload: EditTweetInput) {
    editTweet(payload: $payload) {
      id
      content
      mediaArray
      author {
        firstName
        lastName
        userName
        profileImgUrl
      }
    }
  }
`

export const createTweetMutate = async (payload: createTweetMutateProps) => {
  const data = await graphqlClient.request(CREATE_TWEET, { payload });
  return data;
};

export const deleteTweetMutate = async (payload: { tweetId: string }) => {
  const data = await graphqlClient.request(DELETE_TWEET, { payload });
  return data;
};

export const editTweetMutate=async(payload:{content:string,mediaArray:string[],tweetId:string})=>{
  const data=await graphqlClient.request(EDIT_TWEET,{payload})
  return data;
}