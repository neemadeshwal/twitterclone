import { Tweet } from "@prisma/client";
import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";

const queries = {
  getAllTweet: async (parent: any, payload: any, ctx: GraphqlContext) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.No token present");
    }
    const tweets = await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true, LikedBy: true },
    });
    console.log(tweets, "tweets....");
    return tweets;
  },
  getSingleTweet: async (
    parent: any,
    { payload }: { payload: { id: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.No token present");
    }
    const { id } = payload;
    if (!id) {
      throw new Error("no id present");
    }
    const tweet = await prismaClient.tweet.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!tweet) {
      throw new Error("no user with this id.");
    }
    return tweet;
  },
};
const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: { content: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.No token present");
    }
    const { content } = payload;
    if (!content) {
      throw new Error("No content .Please provide content first.");
    }
    const tweet = await prismaClient.tweet.create({
      data: {
        content,
        authorId: ctx.user.id,
      },
    });
    return tweet;
  },
};

const extraResolvers = {
  Tweet: {
    author: async (parent: Tweet) => {
      console.log("hello");
      if (!parent.id) {
        throw new Error("No tweet present");
      }

      const author = await prismaClient.user.findUnique({
        where: { id: parent.authorId },
      });

      return author;
    },
    LikedBy: async (parent: Tweet) => {
      const LikedBy = await prismaClient.like.findUnique({
        where: {
          userId_tweetId: {
            userId: parent.authorId, // Pass the userId as an argument
            tweetId: parent.id,
          },
        },
      });
      return LikedBy;
    },
  },
};

export const resolvers = { queries, mutations, extraResolvers };
