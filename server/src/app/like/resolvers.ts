import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";

const mutations = {
  toggleLikeTweet: async (
    parent: any,
    { payload }: { payload: { tweetId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.Token not present.");
    }
    const { tweetId } = payload;

    if (!tweetId) {
      throw new Error("No tweetId present.");
    }

    const findLike = await prismaClient.like.findUnique({
      where: {
        userId_tweetId: {
          userId: ctx.user.id,
          tweetId,
        },
      },
    });

    if (findLike) {
      const unlike = await prismaClient.like.delete({
        where: {
          userId_tweetId: {
            userId: ctx.user.id,
            tweetId,
          },
        },
      });
      return unlike;
    } else {
      const like = await prismaClient.like.create({
        data: {
          userId: ctx.user.id,
          tweetId: tweetId,
        },
      });
      return like;
    }
  },
};

export const resolvers = { mutations };
