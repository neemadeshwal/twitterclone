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
        likedBy: true,
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
  getUserFollowingTweet: async (
    parent: any,
    payload: any,
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.");
    }

    const isUserExist = await prismaClient.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      include: {
        followingList: {
          select: {
            followingId: true,
            followerId: true,
          },
        },
      },
    });

    if (!isUserExist) {
      throw new Error("No user exist");
    }

    const followingTweet = await prismaClient.tweet.findMany({
      where: {
        authorId: {
          in: isUserExist.followingList.map((follow) => follow.followerId),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return followingTweet;
  },
  getForYou:async(parent:any,payload:any,ctx:GraphqlContext)=>{
    if(!ctx.user){
      throw new Error("Unauthroized")
    }

    const forYouTweet=await prismaClient.tweet.findMany({

      where:{
        OR: [
          {
            likedBy: {
              some: {}
            }
          },
          {
            commentAuthor: {
              some: {}
            }
          },
          {
            repostTweet: {
              some: {}
            }
          }
        ]
      },
        orderBy:{
          likedBy:{
            _count:'desc'
          }
        },
        take:5,
        include:{
          likedBy:{
            include:{
              user:true
            }
          }
        }
    })
    const forYouHashtag = await prismaClient.hashtag.findMany({
      orderBy: {
        tweets: {
          _count: 'desc',
        },
      },
      take: 5, // Top 5 popular hashtags
      include: {
        tweets: true, // Include tweets related to each hashtag
      },
    });

    const forYouUser = await prismaClient.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: ctx.user.id
            }
          },
          {
            followers: {
              none: {
                followingId: ctx.user.id
              }
            }
          },
      
          {
            posts: {
              some: {}
            }
          }
        ]
      },
      orderBy: [
        {
          followers: {
            _count: 'desc'
          }
        },
        {
          posts: {
            _count: 'desc'
          }
        }
      ],
      take: 5,
      include: {
        posts: {
          take: 3, 
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            likedBy: true,
            commentAuthor: true
          }
        },
        followers: true,
        _count: {
          select: {
            followers: true,
            posts: true
          }
        }
      }
    });
    



  
     return{forYouHashtag,forYouTweet,forYouUser}
  },

  getAllTrending:async(parent:any,payload:any,ctx:GraphqlContext)=>{
    
    if(!ctx.user){
      throw new Error("Unauthroized")
    }

   
    
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
      const tweets = await prismaClient.tweet.findMany({
        where: {
          AND: [
            {
              createdAt: {
                gte: lastWeek
              }
            },
            {
              OR: [
                {
                  likedBy: {
                    some: {}
                  }
                },
                {
                  commentAuthor: {
                    some: {}
                  }
                },
                {
                  repostTweet: {
                    some: {}
                  }
                }
              ]
            }
          ]
        },
        include: {
          author: true
          ,
          likedBy: {
            where: {
              createdAt: {
                gte: last24Hours
              }
            },
            include: {
              user: true
              }
            }
          ,
          commentAuthor: {
            where: {
              createdAt: {
                gte: last24Hours
              }
            }
          },
          repostTweet: {
            where: {
              createdAt: {
                gte: last24Hours
              }
            }
          },
          hashtags: true
        }
        })
      
    
      // Calculate engagement score for each tweet
      const tweetsWithScore = tweets.map((tweet:any) => {
        const recentLikes = tweet.likedBy.length;
        const recentComments = tweet.commentAuthor.length;
        const recentReposts = tweet.repostTweet.length;
    
        // Calculate engagement score with weights
        const engagementScore = 
          recentLikes * 1 +      // Base weight for likes
          recentComments * 2 +   // Comments weighted higher
          recentReposts * 3;     // Reposts weighted highest
    
        // Factor in time decay
        const hoursOld = (Date.now() - new Date(tweet.createdAt).getTime()) / (1000 * 60 * 60);
        const timeDecayFactor = 1 / Math.pow(hoursOld + 2, 0.5); // Add 2 to avoid division by zero
    
        // Final score combines engagement and time decay
        const finalScore = engagementScore * timeDecayFactor;
    
        return {
          ...tweet,
          engagementScore: finalScore
        };
      });
    
      // Sort by final score and take top 10
      const trendingTweet = tweetsWithScore
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, 10);
    
   
    
    
    
      // Get timestamp for last 24 hours
    
      // Get hashtags and their engagement metrics
      const hashtags = await prismaClient.hashtag.findMany({
        where: {
          tweets: {
            some: {
              createdAt: {
                gte: last24Hours,
              },
            },
          },
        },
        include: {
          tweets: {
            where: {
              createdAt: {
                gte: last24Hours,
              },
            },
            include: {
              likedBy: true,
              commentAuthor: true,
              repostTweet: true,
            },
          },
        },
      });
    
      // Calculate engagement score for each hashtag based on tweet interactions
      const hashtagsWithScore = hashtags.map((hashtag) => {
        let engagementScore = 0;
    
        hashtag.tweets.forEach((tweet) => {
          const recentLikes = tweet.likedBy.length;
          const recentComments = tweet.commentAuthor.length;
          const recentReposts = tweet.repostTweet.length;
    
          engagementScore +=
            recentLikes * 1 +
            recentComments * 2 +
            recentReposts * 3; // Adjust weights as needed
        });
    
        return {
          ...hashtag,
          engagementScore,
        };
      })
      const trendingHashtag = hashtagsWithScore
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 10);
  
  
    console.log(trendingHashtag,"trending hastage")
    
      
        // Get timestamp for last 24 hours
      
        // Get users and their tweets with engagement metrics
        const users = await prismaClient.user.findMany({
          where: {
            AND:[
              {
                
                  createdAt: {
                    gte: last24Hours,
                  },
  
            
              },
              {
              
                  followers: {
                    some: {}, // This checks if the user has at least one follower
                  },
              }
             
            ]
           
          },
          include: {
            posts: {
              where: {
                createdAt: {
                  gte: last24Hours,
                },
              },
              include: {
                likedBy: true,
                commentAuthor: true,
                repostTweet: true,
              },
            },
          },
        });
        console.log(users,"users users")
      
        // Calculate total engagement score for each user
        const usersWithScore = users.map((user) => {
          let totalEngagement = 0;
      
          user.posts.forEach((tweet) => {
            const recentLikes = tweet.likedBy.length;
            const recentComments = tweet.commentAuthor.length;
            const recentReposts = tweet.repostTweet.length;
      
            totalEngagement +=
              recentLikes * 1 +
              recentComments * 2 +
              recentReposts * 3;
          });
      
          return {
            ...user,
            totalEngagement,
          };
        });
      
        // Sort users by engagement score and return top trending users
        const trendingUser = usersWithScore
          .sort((a, b) => b.totalEngagement - a.totalEngagement)
          .slice(0, 10);
      
       

        console.log(trendingUser,"trending user")

     return{trendingHashtag,trendingTweet,trendingUser}

    }
}
const mutations = {
  createTweet: async (
    parent: any,
    {
      payload,
    }: {
      payload: { content: string; mediaArray: string[] };
    },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.No token present");
    }
    const { content, mediaArray } = payload;
    if (!content && mediaArray.length == 0) {
      throw new Error("No content .Please provide content first.");
    }
    const hashtags = content.match(/#\w+/g) || [];
    const cleanContent = content.replace(/#\w+/g, "").trim();

    if (hashtags.length == 0) {
      const tweet = await prismaClient.tweet.create({
        data: {
          content: content,
          authorId: ctx.user.id,
          mediaArray,
        },
      });
      return tweet;
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
        mediaArray,
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
  editTweet: async (
    parent: any,
    {
      payload,
    }: { payload: { content: string; mediaArray: string[]; tweetId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("No user found");
    }
    const { content, mediaArray, tweetId } = payload;

    if (!tweetId) {
      throw new Error("No tweet id is present");
    }
    if (!content && mediaArray.length === 0) {
      throw new Error("No content present.");
    }

    const isTweetExist = await prismaClient.tweet.findUnique({
      where: {
        id: tweetId,
      },
    });

    const hashtags = content.match(/#\w+/g) || [];
    const cleanContent = content.replace(/#\w+/g, "").trim();

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

    if (!isTweetExist) {
      throw new Error("tweet donot exist");
    }

    const updatedTweet = await prismaClient.tweet.update({
      where: {
        id: tweetId,
      },
      data: {
        content: cleanContent,
        mediaArray: mediaArray,
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
    return updatedTweet;
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
    likedBy: async (parent: Tweet) => {
      const LikedBy = await prismaClient.like.findMany({
        where: {
          tweetId: parent.id,
        },
        include:{
          user:true
        }
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
    savedPost: async (parent: Tweet) => {
      const savedPost = await prismaClient.savedPost.findMany({
        where: {
          tweetId: parent.id,
        },
      });
      return savedPost;
    },
  },
};

export const resolvers = { queries, mutations, extraResolvers };
