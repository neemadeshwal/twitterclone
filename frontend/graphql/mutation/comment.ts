import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";
import { CreateCommentProps } from "../types";
import ReplyComment from "@/components/postDetail/replyOnComment";

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

export const REPLY_COMMENT = gql`
  mutation ReplyComment($payload: replyOnCommentInput!) {
    replyOnComment(payload: $payload) {
      id
      comment
      userId
    }
  }
`;
export const createComment = async (payload: CreateCommentProps) => {
  const data = await graphqlClient.request(CREATE_COMMENT, { payload });
  return data;
};

export const replyOnComment = async (payload: {
  comment: string;
  commentId: string;
  mediaArray: string[];
}) => {
  const data = await graphqlClient.request(REPLY_COMMENT, { payload });
  return data;
};
