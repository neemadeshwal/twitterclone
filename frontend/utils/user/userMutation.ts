import { useMutation } from "@tanstack/react-query";
import { followUser } from "@/graphql/mutation/follows";

interface FollowUserResponse {
  success: boolean;
  message?: string;
}

interface FollowUserVariables {
  userToFollowId: string;
}

interface UseFollowUserOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useFollowUser = (options?: UseFollowUserOptions) => {
  const mutation = useMutation<FollowUserResponse, Error, FollowUserVariables>({
    mutationFn: followUser,
    onSuccess: (response) => {
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });   

  const followUserFn = async (userToFollowId: string) => {
    if (!userToFollowId) {
      throw new Error("User ID is required");
    }

    const body = {
      userToFollowId,
    };

    try {
      await mutation.mutateAsync(body);
      return true;
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  }
  return {
    followUserFn,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
