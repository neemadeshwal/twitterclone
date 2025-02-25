import {
  authorType,
  getAllHashTagsProps,
  getAllTrending,
  getAllTrendingProps,
  GetAllTweetProps,
  getAllUsersQueryProps,
  getCurrentUser,
  getCurrentUserQueryProps,
  getForYou,
  getForYouProps,
  getUserByUserNameProps,
  HashTag,
  Tweet,
} from "@/graphql/types";
import {
  getAllUsersQuery,
  getCurrentUserQuery,
  getUserByUserNameQuery,
} from "@/graphql/query/user";
import { cookies } from "next/headers";
import { GraphQLClient } from "graphql-request";
import { SERVER_URL } from "../constants";
import {
  allHashTagQuery,
  getAllTrendingQuery,
  getAllTweetQuery,
  getForYouQuery,
} from "@/graphql/query/tweet";

export const getGraphQLClient = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log(token, "token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  return new GraphQLClient(SERVER_URL!, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `token=${token}`,
    },
  });
};
export const getCurrentUserData = async (): Promise<getCurrentUser | null> => {
  try {
    const client = await getGraphQLClient();

    const data = await client.request<getCurrentUserQueryProps>(
      getCurrentUserQuery
    );
    return data.getCurrentUser;
  } catch (error) {
    console.error("Error fetching current user data:", error);
    return null;
  }
};
export const getUserDetailData = async (): Promise<authorType | null> => {
  try {
    const client = await getGraphQLClient();
    const data = await client.request<getUserByUserNameProps>(
      getUserByUserNameQuery
    );
    return data.getUserByUserName;
  } catch (error) {
    console.error("Error fetching current user data:", error);
    return null;
  }
};

export const getForYouData = async (): Promise<getForYou | null> => {
  try {
    const client = await getGraphQLClient();
    const data = await client.request<getForYouProps>(getForYouQuery);
    return data.getForYou;
  } catch (error) {
    console.error("Error fetching current user data:", error);
    return null;
  }
};

export const getAllTrendingData = async (): Promise<getAllTrending | null> => {
  try {
    const client = await getGraphQLClient();
    const data = await client.request<getAllTrendingProps>(getAllTrendingQuery);
    return data.getAllTrending;
  } catch (error) {
    console.log("an error occured");
    return null;
  }
};

export const getAllUsersData = async (): Promise<getCurrentUser[] | null> => {
  try {
    const client = await getGraphQLClient();
    const data = await client.request<getAllUsersQueryProps>(getAllUsersQuery);
    return data.getAllUsers;
  } catch (error) {
    console.log("an error occured", error);
    return null;
  }
};

export const getAllHashTagData = async (): Promise<HashTag[] | null> => {
  try {
    const client = await getGraphQLClient();
    const data = await client.request<getAllHashTagsProps>(allHashTagQuery);
    return data.getAllHashTags;
  } catch (error) {
    console.log("an error occured");
    return null;
  }
};

export const getAllPostData = async (): Promise<Tweet[] | null> => {
  try {
    const client = await getGraphQLClient();
    const data = await client.request<GetAllTweetProps>(getAllTweetQuery);
    return data.getAllTweet;
  } catch (error) {
    console.log("an error occured");
    return null;
  }
};
