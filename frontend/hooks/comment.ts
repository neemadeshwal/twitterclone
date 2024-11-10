import { graphqlClient } from "@/clients/api";
import { getCommentByIdQuery } from "@/graphql/query/comment";
import { GetSingleCommentProps } from "@/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useGetCommentById = (id: String) => {
  const query = useQuery<GetSingleCommentProps>({
    queryKey: ["single-comment", id],
    queryFn: () =>
      graphqlClient.request(getCommentByIdQuery, {
        payload: { commentId: id },
      }),
    staleTime: 1000 * 60 * 5,
  });
  console.log(query.data, "querydata");
  return { ...query, singleComment: query.data?.getCommentById };
};
