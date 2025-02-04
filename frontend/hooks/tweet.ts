import { graphqlClient } from "@/clients/api";
import {
  allHashTagQuery,
  getAllTweetQuery,
  getSingleTweetQuery,
  getUserFollowingTweet,
} from "@/graphql/query/tweet";
import {
  getAllHashTagsProps,
  GetAllTweetProps,
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
