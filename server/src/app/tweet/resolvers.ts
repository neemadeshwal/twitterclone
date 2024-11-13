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
      include: {
        hashtags: true,
      },
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
      include: {
        author: true,
        LikedBy: true,
        commentAuthor: true,
        hashtags: true,
      },
    });
    if (!tweet) {
      throw new Error("no user with this id.");
    }
    return tweet;
  },
  getAllHashTags: async (parent: any, payload: any, ctx: GraphqlContext) => {
    if (!ctx.user) {
      throw new Error("Unauthorized");
    }

    const allHashtag = await prismaClient.hashtag.findMany({});
    return allHashtag;
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
    const hashtags = content.match(/#\w+/g) || [];
    const cleanContent = content.replace(/#\w+/g, "").trim();

    console.log(hashtags, "hastags");
    if (hashtags.length == 0) {
      return;
    }
    const allHashtag = await Promise.all(
      hashtags.map(async (hashtag) => {
        const findHashTag = await prismaClient.hashtag.findUnique({
          where: {
            text: hashtag.toLowerCase(),
          },
        });

        if (!findHashTag) {
          const findHashTag = await prismaClient.hashtag.create({
            data: {
              text: hashtag.toLowerCase(),
            },
          });
          return findHashTag;
        }
        return findHashTag;
      })
    );
    const tweet = await prismaClient.tweet.create({
      data: {
        content: cleanContent,
        authorId: ctx.user.id,
        photoArray,
        videoArray,
        hashtags: {
          connect:
            allHashtag.length !== 0
              ? allHashtag.map((tag) => ({
                  id: tag?.id,
                }))
              : undefined,
        },
      },
    });
    return tweet;
  },
  deleteTweet: async (
    parent: any,
    { payload }: { payload: { tweetId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("unauthorized");
    }
    const { tweetId } = payload;
    if (!tweetId) {
      throw new Error("no tweet id preesent");
    }

    const isTweetExist = await prismaClient.tweet.findUnique({
      where: {
        id: tweetId,
      },
    });

    if (!isTweetExist) {
      throw new Error("no tweet exist ");
    }

    const deleteTweet = await prismaClient.tweet.delete({
      where: {
        id: tweetId,
      },
    });
    return deleteTweet;
  },
};

const extraResolvers = {
  Tweet: {
    author: async (parent: Tweet) => {
      if (!parent.id) {
        throw new Error("No tweet present");
      }

      const author = await prismaClient.user.findUnique({
        where: { id: parent.authorId },
      });

      return author;
    },
    LikedBy: async (parent: Tweet) => {
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
      return comments;
    },
    repostTweet: async (parent: Tweet) => {
      const repost = await prismaClient.repost.findMany({
        where: {
          tweetId: parent.id,
        },
        include: {
          tweet: true,
          user: true,
        },
      });
      return repost;
    },
    hashtags: async (parent: Tweet) => {
      console.log("hashtag scheck");
      const hashtag = await prismaClient.hashtag.findMany({
        where: {
          tweets: {
            some: {
              id: parent.id,
            },
          },
        },
      });
      return hashtag;
    },
  },
};

export const resolvers = { queries, mutations, extraResolvers };
