import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";

const mutations = {
  toggleRepostTweet: async (
    parent: any,
    { payload }: { payload: { tweetId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("no user present.");
    }
    const { tweetId } = payload;

    if (!tweetId) {
      throw new Error("no id present");
    }
    const repostTweet = await prismaClient.repost.findUnique({
      where: {
        userId_tweetId: {
          userId: ctx.user.id,
          tweetId,
        },
      },
    });
    if (repostTweet) {
      const repostTweet = await prismaClient.repost.delete({
        where: {
          userId_tweetId: {
            userId: ctx.user.id,
            tweetId,
          },
        },
      });
      return repostTweet;
    } else {
      const repostTweet = await prismaClient.repost.create({
        data: {
          tweetId: tweetId,
          userId: ctx.user.id,
        },
      });
      return repostTweet;
    }
  },
  toggleRepostComment: async (
    parent: any,
    { payload }: { payload: { commentId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("no user present.");
    }
    const { commentId } = payload;

    if (!commentId) {
      throw new Error("no id present");
    }
    const repostTweet = await prismaClient.repost.findUnique({
      where: {
        userId_commentId: {
          userId: ctx.user.id,
          commentId,
        },
      },
    });
    if (repostTweet) {
      const repostTweet = await prismaClient.repost.delete({
        where: {
          userId_commentId: {
            userId: ctx.user.id,
            commentId,
          },
        },
      });
      return repostTweet;
    } else {
      const repostTweet = await prismaClient.repost.create({
        data: {
          tweetId: commentId,
          userId: ctx.user.id,
        },
      });
      return repostTweet;
    }
  },
};

export const resolvers = { mutations };
