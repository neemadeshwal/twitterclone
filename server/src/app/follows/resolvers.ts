import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";

const mutations = {
  followUser: async (
    parent: any,
    { payload }: { payload: { userToFollowId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.Please provide token.");
    }
    const { userToFollowId } = payload;
    if (!userToFollowId) {
      throw new Error("no id present.");
    }

    const followUserExist = await prismaClient.user.findUnique({
      where: { id: userToFollowId },
    });

    if (!followUserExist) {
      throw new Error("No user with this id exist.");
    }

    const isAlreadyFollowing = await prismaClient.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: ctx.user.id,
          followingId: userToFollowId,
        },
      },
    });

    if (isAlreadyFollowing) {
      throw new Error("You are already following this user");
    }

    const follow = await prismaClient.follows.create({
      data: {
        followerId: ctx.user.id,
        followingId: userToFollowId,
      },
    });
    return follow;
  },
  unfollowUser: async (
    parent: any,
    { payload }: { payload: { userToUnfollowId: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.");
    }
    const { userToUnfollowId } = payload;

    if (!userToUnfollowId) {
      throw new Error("no id present.");
    }

    const userExist = await prismaClient.user.findUnique({
      where: {
        id: userToUnfollowId,
      },
    });

    if (!userExist) {
      throw new Error("User doesn't exist.");
    }

    const isAlreadyUnfollowing = await prismaClient.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: ctx.user.id,
          followingId: userToUnfollowId,
        },
      },
    });

    if (!isAlreadyUnfollowing) {
      throw new Error("you are not following this user.");
    }

    const unfollowUser = await prismaClient.follows.delete({
      where: {
        followerId_followingId: {
          followerId: ctx.user.id,
          followingId: userToUnfollowId,
        },
      },
    });
    return unfollowUser;
  },
};

export const resolvers = { mutations };
