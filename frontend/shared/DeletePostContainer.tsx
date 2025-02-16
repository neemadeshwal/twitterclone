import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import CenterDialog from "./CenterDialog";
import { useCommentMutation } from "@/hooks/mutation/useCommentMutation";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";

const DeletePostContainer = ({
  setDeleteDialog,
  postId: id,
  ref,
  setPostControlDialogOpen,
  isComment,
}: {
  setDeleteDialog: any;
  postId: string;
  ref?: any;
  setPostControlDialogOpen: any;
  isComment?: boolean;
}) => {
  const queryClient = useQueryClient();

  const { deleteComment } = useCommentMutation({
    onSuccess: () => {
      setDeleteDialog(false);
      queryClient.refetchQueries({ queryKey: ["all-tweet"] });
    },
  });
  const { deleteTweet } = useTweetMutation({
    onSuccess: () => {
      setDeleteDialog(false);
      queryClient.refetchQueries({ queryKey: ["all-tweet"] });
    },
  });

  const handleDeletePost = async () => {
    if (!id) {
      return;
    }
    const body = {
      tweetId: id,
    };
    try {
      await deleteTweet(body);
      setDeleteDialog(false);
      setPostControlDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    if (!id) {
      return;
    }
    const body = {
      commentId: id,
    };
    try {
      await deleteComment(body);
      setDeleteDialog(false);
      setPostControlDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const title = "delete post?";
  const content =
    "This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.";
  const actionBtn = {
    name: "delete",
    action: isComment ? handleDeleteComment : handleDeletePost,
  };
  const setCloseDialog = setDeleteDialog;
  return (
    <div>
      <CenterDialog
        title={title}
        content={content}
        actionBtn={actionBtn}
        setCloseDialog={setCloseDialog}
      />
    </div>
  );
};

export default DeletePostContainer;
