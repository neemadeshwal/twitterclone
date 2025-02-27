import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import CenterDialog from "./CenterDialog";
import { useCommentMutation } from "@/hooks/mutation/useCommentMutation";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";

const DeletePostContainer = ({
  setDeleteDialog,
  postId: id,
  setPostControlDialogOpen,
  isComment,
}: {
  setDeleteDialog: any;
  postId: string;
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

  const handleDelete = async () => {
    console.log("helllo");
    if (!id) {
      return;
    }

    try {
      if (isComment) {
        await deleteComment({ commentId: id });
      } else {
        await deleteTweet({ tweetId: id });
      }
      setDeleteDialog(false);
      setPostControlDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const title = "Delete post?";
  const content =
    "This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.";
  const actionBtn = {
    name: "Delete",
    action: handleDelete,
  };

  return (
    <CenterDialog
      title={title}
      content={content}
      actionBtn={actionBtn}
      setCloseDialog={setDeleteDialog}
    />
  );
};

export default DeletePostContainer;
