import { graphqlClient } from "@/clients/api";
import {
  allHashTagQuery,
  getAllTrending,
  getAllTweetQuery,
  getForYouQuery,
  getSingleTweetQuery,
  getUserFollowingTweet,
} from "@/graphql/query/tweet";
import {
  getAllBookmarksProps,
  getAllHashTagsProps,
  getAllTrendingProps,
  GetAllTweetProps,
  getForYouProps,
  getSingleTweetProps,
  GetUserFollowingTweetProps,
} from "@/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useAllTweet = () => {
  const query = useQuery<GetAllTweetProps>({
    queryKey: ["all-tweet"],
    queryFn: () => graphqlClient.request(getAllTweetQuery),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  console.log(query, "query query");
  return {
    allTweet: query.data?.getAllTweet,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const usegetUserFollowingTweet = () => {
  const query = useQuery<GetUserFollowingTweetProps>({
    queryKey: ["user-following-tweet"],
    queryFn: () => graphqlClient.request(getUserFollowingTweet),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return {
    userFollowingTweet: query.data?.getUserFollowingTweet,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useGetSingleTweet = (id: String) => {
  const query = useQuery<getSingleTweetProps>({
    queryKey: ["single-tweet", id],
    queryFn: () =>
      graphqlClient.request(getSingleTweetQuery, { payload: { id } }),
    staleTime: 1000 * 60 * 5,
  });
  return { ...query, singleTweet: query.data?.getSingleTweet };
};

export const useGetAllHashTag = () => {
  const query = useQuery<getAllHashTagsProps>({
    queryKey: ["all-hashtag"],
    queryFn: () => graphqlClient.request(allHashTagQuery),
    staleTime: 1000 * 60 * 5,
  });
  console.log(query, "query query");
  return { ...query, allHashtag: query.data?.getAllHashTags };
};

export const usegetForYou= () => {
  const query = useQuery<getForYouProps>({
    queryKey: ["for-you"],
    queryFn: () => graphqlClient.request(getForYouQuery),
    staleTime: 1000 * 60 * 5,
  });
  return { ...query, allForYou: query.data?.getForYou}}


export const useGetAllTrending = () => {
  const query = useQuery<getAllTrendingProps>({
    queryKey: ["all-trending"],
    queryFn: () => graphqlClient.request(getAllTrending),
    staleTime: 1000 * 60 * 5,
  });
  console.log(query.data, "query query check");
  return { ...query, allTrending: query.data?.getAllTrending};}
