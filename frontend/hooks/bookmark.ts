"use client";
import { graphqlClient } from "@/clients/api";
import { getAllBookmarks } from "@/graphql/query/bookmark";
import { getAllBookmarksProps } from "@/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useAllBookmark = () => {
  const query = useQuery<getAllBookmarksProps>({
    queryKey: ["all-bookmark"],
    queryFn: () => graphqlClient.request(getAllBookmarks),
    staleTime: 1000 * 60 * 5,
  });
  return { ...query, allBookmark: query.data?.getAllBookmarks };
};
