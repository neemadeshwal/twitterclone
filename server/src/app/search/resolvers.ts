import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";

const queries = {
  searchQuery: async (
    parent: any,
    { payload }: { payload: { query: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.");
    }
    const { query } = payload;
    console.log(query, "query");
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
    const hashtag = await prismaClient.hashtag.findMany({
      where: {
        text: { contains: query, mode: "insensitive" },
      },
    });
    console.log(post, people, hashtag);
    return { post, people, hashtag };
  },
};

export const resolvers = { queries };
