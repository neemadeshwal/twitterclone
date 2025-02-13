import { equal } from "assert";
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
          {
            lastName:{contains:query,mode:"insensitive"},
          },

          { userName: { contains: query, mode: "insensitive" } },
        ],
        
      },
      orderBy:{
        followers:{
          _count:"desc"
        }
      }
    });
    const latest = await prismaClient.tweet.findMany({
      where: {
        content: { contains: query, mode: "insensitive" },
      },
      orderBy:{
        createdAt:"desc"
      }
    });
    
    const post = await prismaClient.tweet.findMany({
      where: {
        content: { contains: query, mode: "insensitive" },
      },
      orderBy:{
        LikedBy:{
          _count:"desc"
        }
      }
    });

    const media=await prismaClient.tweet.findMany({
      where:{
        mediaArray:{
       isEmpty:false
        }
      }
    })
    const hashtag = await prismaClient.hashtag.findMany({
      where: {
        text: { contains: query, mode: "insensitive" },
      },
      include: {
        tweets: true,
      },
    });
    return { post, people, hashtag,media,latest };
  },
};

export const resolvers = { queries };
