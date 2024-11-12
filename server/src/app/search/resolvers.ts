import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";

const query = {
  searchQuery: async (
    parent: any,
    { payload }: { payload: { query: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.");
    }
    const { query } = payload;
    if (!query) {
      throw new Error("No query present.Please provide query first.");
    }

    const people = await prismaClient.user.findMany({
      where: {
        OR: [
          {
            firstName: { contains: query, mode: "insensitive" },
          },

          { userName: { contains: query, mode: "insensitive" } },
        ],
      },
    });
    const post = await prismaClient.tweet.findMany({
      where: {
        content: { contains: query, mode: "insensitive" },
      },
    });
    return { post, people };
  },
};

export const resolvers = { query };
