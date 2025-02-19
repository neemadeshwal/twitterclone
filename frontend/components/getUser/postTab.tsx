import { Tweet } from "@/graphql/types";
import React from "react";
import SinglePost from "../post/SinglePost/singlePost";

const PostTab = ({ postlist }: { postlist: Tweet[] }) => {
  console.log(postlist, "postlist");

  return (
    <div>
      <div>
        {postlist &&
          postlist.length !== 0 &&
          postlist.map((item) => {
            return <SinglePost tweet={item} key={item.id} />;
          })}
      </div>
    </div>
  );
};

export default PostTab;
