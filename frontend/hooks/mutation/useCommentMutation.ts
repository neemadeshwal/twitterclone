import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCommentProps } from "@/graphql/types";
import { createCommentMutate } from "@/graphql/mutation/comment";
interface useCommentMutationProps {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  }
export const useCommentMutation = ({ onSuccess, onError }: useCommentMutationProps = {}) => {
    const queryClient = useQueryClient();
    console.log("in ts file")
  
    const { mutateAsync, isPending } = useMutation({
      mutationFn: (body: CreateCommentProps) => createCommentMutate(body),

      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
        onSuccess?.();
      },
      onError: (error) => {
        console.log(error);
        onError?.(error);
      },
    });
    const createComment = async (body: CreateCommentProps) => {
        try {
    console.log("in ts file")

          await mutateAsync(body);
        } catch (error) {
          console.log(error);
        }
      };
    
      return { createComment, isPending };
    };