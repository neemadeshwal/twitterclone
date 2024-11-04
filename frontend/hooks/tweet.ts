import { graphqlClient } from "@/clients/api";
import { getAllTweetQuery, getSingleTweetQuery } from "@/graphql/query/tweet";
import { GetAllTweetProps, getSingleTweetProps } from "@/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useAllTweet = () => {
  const query = useQuery<GetAllTweetProps>({
    queryKey: ["all-tweet"],
    queryFn: () => graphqlClient.request(getAllTweetQuery),
  });
  console.log(query, "query query");
  return { ...query, allTweet: query.data?.getAllTweet };
};

export const useGetSingleTweet = (id: String) => {
  const query = useQuery<getSingleTweetProps>({
    queryKey: ["single-tweet", id],
    queryFn: () =>
      graphqlClient.request(getSingleTweetQuery, { payload: { id } }),
  });
  return { ...query, singleTweet: query.data?.getSingleTweet };
};
