import React, { useEffect, useRef, useState } from "react";
import { IoEllipsisHorizontal, IoEllipsisVertical } from "react-icons/io5";
import PostActivity from "../postActivity";
import { Comment, Tweet } from "@/graphql/types";
import DrawDialog from "../DrawDialog";
import DeletePostContainer from "../DeletePostContainer";
import PostContainer from "../postContainer";
import useOutsideClick from "../closeContainer";
import PortalContainerWrapper from "../PortalContainerWrapper";

const PostControlDialog = ({
  tweet,
  isComment,
}: {
  tweet: Tweet | Comment;
  isComment?: boolean;
}) => {
  const [isPostControlDialogOpen, setPostControlDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);
  const [editPost, setEditPost] = useState(false);
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  useOutsideClick(postRef, () => setPostControlDialogOpen(false));
  return (
    <div className="">
      <div className="">
        <div className="p-2 rounded-full absolute top-0 right-8 hover:bg-[#1e2034a5] gray hover:text-blue-500 hidden md:inline-block">
          <IoEllipsisHorizontal
            onClick={() => setPostControlDialogOpen(true)}
            className=""
          />

          {isPostControlDialogOpen && (
            <div ref={postRef} className="">
              <PostActivity
                singleTweet={tweet}
                isComment={isComment}
                deleteDialog={deleteDialog}
                setDeleteDialog={setDeleteDialog}
                editPost={editPost}
                setEditPost={setEditPost}
                setIsContainerOpen={setIsContainerOpen}
                setPostControlDialogOpen={setPostControlDialogOpen}
              />
            </div>
          )}
        </div>
        <div className="absolute md:hidden top-0 right-8 ">
          <DrawDialog
            drawerTrigger={<IoEllipsisVertical className="gray" />}
            drawerComp={
              <PostActivity
                editPost={editPost}
                setEditPost={setEditPost}
                isDrawer={true}
                singleTweet={tweet}
                deleteDialog={deleteDialog}
                setIsContainerOpen={setIsContainerOpen}
                setDeleteDialog={setDeleteDialog}
                setPostControlDialogOpen={setPostControlDialogOpen}
                setIsTriggerDrawerOpen={setPostControlDialogOpen}
              />
            }
            setIsOpenProp={setPostControlDialogOpen}
          />
        </div>
      </div>
      {deleteDialog && (
        <DeletePostContainer
          postId={tweet.id}
          isComment={isComment}
          setDeleteDialog={setDeleteDialog}
          setPostControlDialogOpen={setPostControlDialogOpen}
        />
      )}
      {editPost && (
        <PostContainer
          setPostControlDialogOpen={setPostControlDialogOpen}
          isEdit={editPost}
          editTweet={tweet}
          isContainerOpen={isContainerOpen}
          setIsContainerOpen={setIsContainerOpen}
        />
      )}
    </div>
  );
};

export default PostControlDialog;
