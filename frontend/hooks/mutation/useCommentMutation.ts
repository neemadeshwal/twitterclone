import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateCommentProps,
  createCommentResult,
  replyOnCommentResult,
} from "@/graphql/types";
import {
  createCommentMutate,
  deleteCommentMutate,
  replyOnCommentMutate,
} from "@/graphql/mutation/comment";
import { toggleLikeComment } from "@/graphql/mutation/like";
import { repostCommentMutate } from "@/graphql/mutation/repost";
import { toggleBookmarkComment } from "@/graphql/mutation/bookmark";
interface useCommentMutationProps {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}
interface createCommentResponse {
  createComment: createCommentResult;
}
interface replyOnCommentResponse {
  replyOnComment: replyOnCommentResult;
}
const typedCreateComment = (
  data: CreateCommentProps
): Promise<createCommentResponse> => {
  return createCommentMutate(data) as Promise<createCommentResponse>;
};

const typedReplyOnComment = (data: {
  content: string;
  commentId: string;
  mediaArray: string[];
}): Promise<replyOnCommentResponse> => {
  return replyOnCommentMutate(data) as Promise<replyOnCommentResponse>;
};

export const useCommentMutation = ({
  onSuccess,
  onError,
}: useCommentMutationProps = {}) => {
  const queryClient = useQueryClient();
  console.log("in ts file");

  const createCommentMutation = useMutation({
    mutationFn: typedCreateComment,

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
      queryClient.invalidateQueries({ queryKey: ["single-comment"] });
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });

      queryClient.invalidateQueries({
        queryKey: ["user-detail"],
      });
      onSuccess?.();
      return response;
    },
    onError: (error) => {
      console.log(error);
      onError?.(error);
    },
  });
  const likeCommentMutation = useMutation({
    mutationFn: (body: { commentId: string }) => toggleLikeComment(body),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
      queryClient.invalidateQueries({ queryKey: ["single-comment"] });
      onSuccess?.();
    },
    onError: (error) => {
      console.log(error);
      onError?.(error);
    },
  });
  const replyOnCommentMutation = useMutation({
    mutationFn: typedReplyOnComment,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["single-comment"] });
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
      return response;
    },
  });

  const repostCommentMutation = useMutation({
    mutationFn: (body: { commentId: string }) => repostCommentMutate(body),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["single-comment"] });
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
    },
  });

  const saveCommentMutation = useMutation({
    mutationFn: (body: { commentId: string }) => toggleBookmarkComment(body),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["single-comment"] });
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (body: { commentId: string }) => deleteCommentMutate(body),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["all-comment"] });
      queryClient.invalidateQueries({
        queryKey: ["single-tweet"],
      });
    },
  });

  const createComment = async (body: CreateCommentProps) => {
    try {
      const response = await createCommentMutation.mutateAsync(body);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const likeComment = async (body: { commentId: string }) => {
    try {
      console.log("check kar kar like");
      await likeCommentMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  };
  const replyOnComment = async (body: {
    content: string;
    commentId: string;
    mediaArray: string[];
  }) => {
    try {
      const response = await replyOnCommentMutation.mutateAsync(body);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const repostComment = async (body: { commentId: string }) => {
    try {
      await repostCommentMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteComment = async (body: { commentId: string }) => {
    try {
      await deleteCommentMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  };

  const saveComment = async (body: { commentId: string }) => {
    try {
      await saveCommentMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createComment,
    likeComment,
    replyOnComment,
    repostComment,
    deleteComment,
    saveComment,
    isRepostingComment: repostCommentMutation.isPending,
    isTogglingLike: likeCommentMutation.isPending,
    isReplyOnComment: replyOnCommentMutation.isPending,
    isCreatingComment: createCommentMutation.isPending,
  };
};
