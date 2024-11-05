import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";
import { followUserProps, unfollowUserProps } from "../types";

const FOLLOW_USER = gql`
  mutation FollowUser($payload: followUserPayload!) {
    followUser(payload: $payload) {
      followerId
      followingId
    }
  }
`;
const UNFOLLOW_USER = gql`
  mutation UnfollowUser($payload: unfollowUserPayload!) {
    unfollowUser(payload: $payload) {
      followerId
      followingId
    }
  }
`;

export const followUser = async (payload: followUserProps) => {
  const data = await graphqlClient.request(FOLLOW_USER, { payload });
  return data;
};

export const unfollowUser = async (payload: unfollowUserProps) => {
  const data = await graphqlClient.request(UNFOLLOW_USER, { payload });
  return data;
};
