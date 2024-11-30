import { SavedPost } from "@prisma/client";
import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";
import { printSchema } from "graphql";

const queries = {
  getAllBookmarks: async (parent: any, payload: any, ctx: GraphqlContext) => {
    if (!ctx.user) {
      throw new Error("unauthoziedf.");
    }

    const allBookMarks = await prismaClient.savedPost.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
    return allBookMarks;
  },
};

const mutations = {
  toggleSaveTweet: async (
    parent: any,
    { payload }: { payload: { tweetId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.");
    }
    const { tweetId } = payload;
    if (!tweetId) {
      throw new Error("no tweet id ");
    }
    const tweetExist = await prismaClient.tweet.findUnique({
      where: {
        id: tweetId,
      },
    });
    if (!tweetExist) {
      throw new Error("tweet not exist");
    }

    const isTweetSaved = await prismaClient.savedPost.findUnique({
      where: {
        userId_tweetId: {
          userId: ctx.user.id,
          tweetId,
        },
      },
    });
    if (isTweetSaved) {
      const deleteTweet = await prismaClient.savedPost.delete({
        where: {
          userId_tweetId: {
            userId: ctx.user.id,
            tweetId,
          },
        },
      });
      return deleteTweet;
    } else {
      const savedPost = await prismaClient.savedPost.create({
        data: {
          tweetId,
          userId: ctx.user.id,
        },
      });
      return savedPost;
    }
  },
  toggleSaveComment: async (
    parent: any,
    { payload }: { payload: { commentId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.");
    }
    const { commentId } = payload;
    if (!commentId) {
      throw new Error("no comment id ");
    }
    const commentExist = await prismaClient.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!commentExist) {
      throw new Error("comment not exist");
    }

    const isCommentSaved = await prismaClient.savedPost.findUnique({
      where: {
        userId_commentId: {
          userId: ctx.user.id,
          commentId,
        },
      },
    });

    console.log(isCommentSaved, "iscommentsaved");
    if (isCommentSaved) {
      const deleteSavedComment = await prismaClient.savedPost.delete({
        where: {
          userId_commentId: {
            userId: ctx.user.id,
            commentId,
          },
        },
      });
      return deleteSavedComment;
    } else {
      const savedComment = await prismaClient.savedPost.create({
        data: {
          commentId,
          userId: ctx.user.id,
        },
      });
      return savedComment;
    }
  },
};

const extraResolvers = {
  savedPost: {
    tweet: async (parent: SavedPost) => {
      if (!parent.tweetId) {
        return;
      }
      const tweet = await prismaClient.tweet.findUnique({
        where: {
          id: parent.tweetId,
        },
      });
      return tweet;
    },
    user: async (parent: SavedPost) => {
      if (!parent.userId) {
        return;
      }
      const user = await prismaClient.user.findUnique({
        where: {
          id: parent.userId,
        },
      });
      return user;
    },
    comment: async (parent: SavedPost) => {
      if (!parent.commentId) {
        return;
      }
      const comment = await prismaClient.comment.findUnique({
        where: {
          id: parent.commentId,
        },
      });
    },
  },
};

export const resolvers = { queries, mutations, extraResolvers };
