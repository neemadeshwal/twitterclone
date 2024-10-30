import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";

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

export const resolvers = { mutations };
