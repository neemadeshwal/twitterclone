import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";

interface CommentProps {
  id: string;
  userId: string;
  tweetId: string;
}
const mutations = {
  createComment: async (
    parent: any,
    {
      payload,
    }: { payload: { comment: string; mediaArray: string[]; tweetId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.No token present");
    }
    const { comment, tweetId, mediaArray } = payload;

    if (!comment || !tweetId) {
      throw new Error("Please provide comment or tweetid");
    }

    const Comment = prismaClient.comment.create({
      data: {
        comment,
        tweetId,
        userId: ctx.user?.id,
        mediaArray,
      },
    });
    return Comment;
  },
  replyOnComment: async (
    parent: any,
    {
      payload,
    }: {
      payload: { comment: string; commentId: string; mediaArray: string[] };
    },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized");
    }
    const { commentId, comment, mediaArray } = payload;
    if (!commentId) {
      throw new Error("comment id not present.");
    }
    const isCommentExist = await prismaClient.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!isCommentExist) {
      throw new Error("comment doesnot exist");
    }
    const replyComment = await prismaClient.comment.create({
      data: {
        comment,
        mediaArray,
        parentId: commentId,
        userId: ctx.user.id,
      },
    });
    return replyComment;
  },
};

const extraResolvers = {
  Comment: {
    user: async (parent: CommentProps) => {
      const users = await prismaClient.user.findUnique({
        where: { id: parent.userId },
      });
      return users;
    },
    tweet: async (parent: CommentProps) => {
      const tweet = await prismaClient.tweet.findMany({
        where: { id: parent.tweetId },
      });
      return tweet;
    },
  },
};

export const resolvers = { mutations, extraResolvers };
