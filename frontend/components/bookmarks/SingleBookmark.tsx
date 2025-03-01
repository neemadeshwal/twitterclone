import React from "react";
import SinglePost from "../post/SinglePost/singlePost";
import SingleComment from "../postDetail/singleComment";
import { Bookmarks } from "@/graphql/types";

const SingleBookmark = ({ bookmark }: { bookmark: Bookmarks }) => {
  console.log(bookmark);
  if (!bookmark) {
    return <div>nothing there</div>;
  }
  if (bookmark.tweetId) {
    console.log("tweet id");
    return <SinglePost tweet={bookmark.tweet} />;
  }
  if (bookmark.commentId) {
    return <SingleComment comment={bookmark.comment} />;
  } else {
    return <div>nothing in else block</div>;
  }
};

export default SingleBookmark;
