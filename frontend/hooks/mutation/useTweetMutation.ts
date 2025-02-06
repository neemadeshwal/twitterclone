// hooks/useTweetMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTweetMutate} from "@/graphql/mutation/tweet";
import { createTweetMutateProps } from "@/graphql/types";

interface UseTweetMutationProps {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useTweetMutation = ({ onSuccess, onError }: UseTweetMutationProps = {}) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: createTweetMutateProps) => createTweetMutate(body),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
      onSuccess?.();
    },
    onError: (error) => {
      console.log(error);
      onError?.(error);
    },
  });

  const createTweet = async (body: createTweetMutateProps) => {
    try {
      await mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  };

  return { createTweet, isPending };
};