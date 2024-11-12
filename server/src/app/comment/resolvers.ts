import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";

interface CommentProps {
  id: string;
  userId: string;
  tweetId: string;
}

const queries = {
  getCommentById: async (
    parent: any,
    { payload }: { payload: { commentId: string } },
    ctx: GraphqlContext
  ) => {
    console.log("hey");
    if (!ctx.user) {
      throw new Error("Unauthorized.");
    }

    const { commentId } = payload;

    console.log(commentId);
    if (!commentId) {
      throw new Error("No comment id presnt");
    }

    const isCommentExist = await prismaClient.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        likes: true,
        replies: true,
      },
    });

    if (!isCommentExist) {
      throw new Error("No comment exist with this id.");
    }
    console.log(isCommentExist, "iscoemmnt eixst");
    return isCommentExist;
  },
};
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
      console.log(users, "users find");
      console.log("user comment user");
      return users;
    },
    tweet: async (parent: CommentProps) => {
      console.log("tweet check");
      if (!parent.tweetId) {
        return null;
      }

      console.log("tweet eixsit");
      const tweet = await prismaClient.tweet.findUnique({
        where: { id: parent.tweetId },
      });
      console.log("user comment user tweet");

      return tweet;
    },
    likes: async (parent: CommentProps) => {
      console.log("lieks hey");
      const likes = await prismaClient.like.findMany({
        where: { commentId: parent.id },
      });
      console.log(likes, "likes in comment");
      return likes;
    },
    replies: async (parent: CommentProps) => {
      const comment = await prismaClient.comment.findMany({
        where: {
          parentId: parent.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      console.log(comment, "checking replies");
      return comment;
    },
    repostComment: async (parent: CommentProps) => {
      const repostComment = await prismaClient.repost.findMany({
        where: {
          commentId: parent.id,
        },
        include: {
          comment: true,
          user: true,
        },
      });
      return repostComment;
    },
  },
};

export const resolvers = { mutations, extraResolvers, queries };
