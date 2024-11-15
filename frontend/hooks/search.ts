import { graphqlClient } from "@/clients/api";
import { getSearchByQuery } from "@/graphql/query/search";
import { searchQueryProps } from "@/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useSearchquery = (search: string) => {
  const query = useQuery<any>({
    queryKey: ["search-query", search],
    queryFn: () =>
      graphqlClient.request(getSearchByQuery, {
        payload: {
          query: search,
        },
      }),
  });
  console.log(query.data, "querydata");

  return { ...query, allSearchResult: query.data?.searchQuery };
};
