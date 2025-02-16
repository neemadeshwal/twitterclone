import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";
import { CreateCommentProps } from "../types";
import ReplyComment from "@/components/postDetail/replyOnComment";

const CREATE_COMMENT = gql`
  mutation CreateComment($payload: createCommentInput!) {
    createComment(payload: $payload) {
      id
      content
      authorId
      tweetId
    }
  }
`;

export const REPLY_COMMENT = gql`
  mutation ReplyComment($payload: replyOnCommentInput!) {
    replyOnComment(payload: $payload) {
      id
      content
      authorId
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($payload: deleteCommentInput!) {
    deleteComment(payload: $payload) {
      id
      content
      authorId
    }
  }
`;
export const createCommentMutate = async (payload: CreateCommentProps) => {
  const data = await graphqlClient.request(CREATE_COMMENT, { payload });
  return data;
};

export const replyOnCommentMutate = async (payload: {
  content: string;
  commentId: string;
  mediaArray: string[];
}) => {
  const data = await graphqlClient.request(REPLY_COMMENT, { payload });
  return data;
};

export const deleteCommentMutate = async (payload: { commentId: string }) => {
  const data = await graphqlClient.request(DELETE_COMMENT, { payload });
  return data;
};