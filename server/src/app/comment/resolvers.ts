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
    { payload }: { payload: { comment: string; tweetId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.No token present");
    }
    const { comment, tweetId } = payload;

    if (!comment || !tweetId) {
      throw new Error("Please provide comment or tweetid");
    }

    const Comment = prismaClient.comment.create({
      data: {
        comment,
        tweetId,
        userId: ctx.user?.id,
      },
    });
    return Comment;
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
