import { graphqlClient } from "@/clients/api";
import {
  getAllUsersQuery,
  getCurrentUserQuery,
  getUserByUserNameQuery,
} from "@/graphql/query/user";
import {
  getAllUsersQueryProps,
  getCurrentUserQueryProps,
  getUserByUserNameProps,
} from "@/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery<getCurrentUserQueryProps>({
    queryKey: ["current-user"],
    queryFn: () => graphqlClient.request(getCurrentUserQuery),
    staleTime: 1000 * 60 * 5,
  });
  return { ...query, user: query.data?.getCurrentUser };
};

export const useGetUserByUserName = (userName: string) => {
  const query = useQuery<getUserByUserNameProps>({
    queryKey: ["user-detail"],
    queryFn: () =>
      graphqlClient.request(getUserByUserNameQuery, { payload: { userName } }),
  });
  console.log(query.data, "data");
  return { ...query, user: query.data?.getUserByUserName };
};

export const useGetAllUsers = () => {
  const query = useQuery<getAllUsersQueryProps>({
    queryKey: ["all-users"],
    queryFn: () => graphqlClient.request(getAllUsersQuery),
    staleTime: 1000 * 60 * 5,
  });
  return { ...query, allUsers: query.data?.getAllUsers };
};
