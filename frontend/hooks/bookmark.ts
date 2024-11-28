import { graphqlClient } from "@/clients/api";
import { getAllBookmarks } from "@/graphql/query/bookmark";
import { useQuery } from "@tanstack/react-query";

export const useAllBookmark = () => {
  const query = useQuery<any>({
    queryKey: ["all-bookmark"],
    queryFn: () => graphqlClient.request(getAllBookmarks),
    staleTime: 1000 * 60 * 5,
  });
  return { ...query, allBookmark: query.data?.allBookmark };
};
