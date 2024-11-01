import { graphqlClient } from "@/clients/api";
import { getCurrentUserQuery, getUserByIdQuery } from "@/graphql/query/user";
import { getCurrentUserQueryProps, getUserByIdProps } from "@/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery<getCurrentUserQueryProps>({
    queryKey: ["current-user"],
    queryFn: () => graphqlClient.request(getCurrentUserQuery),
    staleTime: 1000 * 60 * 5,
  });
  return { ...query, user: query.data?.getCurrentUser };
};

export const useGetUserById = (id: string) => {
  const query = useQuery<getUserByIdProps>({
    queryKey: ["getUser-byId"],
    queryFn: () => graphqlClient.request(getUserByIdQuery, { payload: { id } }),
  });
  return { ...query, user: query.data?.getUserById };
};
