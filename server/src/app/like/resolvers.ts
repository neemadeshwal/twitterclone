import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";
import { initServer } from "../../app";

interface LikeProps {
  id: string;
  tweetId: string;
  userId: string;
}
const mutations = {
  toggleLikeTweet: async (
    parent: any,
    { payload }: { payload: { tweetId: string } },
    ctx: GraphqlContext
  ) => {
    const { io } = await initServer();
    if (!ctx.user) {
      throw new Error("Unauthorized.Token not present.");
    }
    const { tweetId } = payload;

    if (!tweetId) {
      throw new Error("No tweetId present.");
    }

    const findTweet = await prismaClient.tweet.findUnique({
      where: {
        id: tweetId,
      },
    });

    if (!findTweet) {
      throw new Error("No tweetId with this tweet.");
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
      console.log("like this tweet");
      console.log(findTweet.authorId, "tweet id");
      io.to(findTweet.authorId).emit(
        "likeTweet",
        `${ctx.user.email} liked your post.`
      );

      return like;
    }
  },
  toggleLikeComment: async (
    parent: any,
    { payload }: { payload: { tweetId: string; commentId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.Token not present.");
    }
    const { commentId } = payload;

    if (!commentId) {
      throw new Error("No tweetId or commentId present.");
    }

    const findLike = await prismaClient.like.findUnique({
      where: {
        userId_commentId: {
          userId: ctx.user.id,
          commentId,
        },
      },
    });

    if (findLike) {
      const unlike = await prismaClient.like.delete({
        where: {
          userId_commentId: {
            userId: ctx.user.id,
            commentId,
          },
        },
      });
      return unlike;
    } else {
      const like = await prismaClient.like.create({
        data: {
          userId: ctx.user.id,
          commentId,
        },
      });
      return like;
    }
  },
};

const extraResolvers = {
  Like: {
    user: async (parent: LikeProps) => {
      const user = await prismaClient.user.findMany({
        where: { id: parent.userId },
      });
      return user;
    },
    tweet: async (parent: LikeProps) => {
      const tweet = await prismaClient.tweet.findMany({
        where: { id: parent.tweetId },
      });
      return tweet;
    },
  },
};

export const resolvers = { mutations, extraResolvers };
