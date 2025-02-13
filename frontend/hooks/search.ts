import { graphqlClient } from "@/clients/api";
import { getSearchByQuery } from "@/graphql/query/search";
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

  return { ...query, allSearchResult: query.data?.searchQuery };
};
