import { graphqlClient } from "@/clients/api";
import { getCurrentUserQuery } from "@/graphql/query/user";
import { getCurrentUserQueryProps } from "@/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery<getCurrentUserQueryProps>({
    queryKey: ["current-user"],
    queryFn: () => graphqlClient.request(getCurrentUserQuery),
    staleTime: 1000 * 60 * 5,
  });
  return { ...query, user: query.data?.getCurrentUser };
};
