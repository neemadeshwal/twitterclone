import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";
import { CreateCommentProps } from "../types";

const CREATE_COMMENT = gql`
  mutation CreateComment($payload: createCommentInput!) {
    createComment(payload: $payload) {
      id
      comment
      userId
      tweetId
    }
  }
`;
export const createComment = async (payload: CreateCommentProps) => {
  const data = await graphqlClient.request(CREATE_COMMENT, { payload });
  return data;
};
