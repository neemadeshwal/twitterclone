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
      include: { author: true, LikedBy: true, commentAuthor: true },
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
    {
      payload,
    }: {
      payload: { content: string; photoArray: string[]; videoArray: string[] };
    },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.No token present");
    }
    const { content, photoArray, videoArray } = payload;
    if (!content) {
      throw new Error("No content .Please provide content first.");
    }
    const tweet = await prismaClient.tweet.create({
      data: {
        content,
        authorId: ctx.user.id,
        photoArray,
        videoArray,
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
      console.log("hello two");

      const author = await prismaClient.user.findUnique({
        where: { id: parent.authorId },
      });
      console.log("ig got the author");

      return author;
    },
    LikedBy: async (parent: Tweet) => {
      console.log("ig got the author");

      const LikedBy = await prismaClient.like.findMany({
        where: {
          tweetId: parent.id,
        },
      });
      return LikedBy;
    },
    commentAuthor: async (parent: Tweet) => {
      const comments = await prismaClient.comment.findMany({
        where: { tweetId: parent.id },
        orderBy: { createdAt: "desc" },
        include: { likes: true, replies: true, parent: true },
      });
      console.log(comments, "comments");
      return comments;
    },
  },
};

export const resolvers = { queries, mutations, extraResolvers };
