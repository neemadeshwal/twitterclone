import { graphqlClient } from "@/clients/api";
import { getAllTweetQuery } from "@/graphql/query/tweet";
import { GetAllTweetProps } from "@/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useAllTweet = () => {
  const query = useQuery<GetAllTweetProps>({
    queryKey: ["all-tweet"],
    queryFn: () => graphqlClient.request(getAllTweetQuery),
    staleTime: 1000 * 60 * 5,
  });
  console.log(query, "query query");
  return { ...query, allTweet: query.data?.getAllTweet };
};
