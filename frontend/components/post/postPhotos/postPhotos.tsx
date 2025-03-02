"use client";
import PostDetail from "@/components/postDetail/postDetail";
import { usePathname } from "next/navigation";
import { useGetSingleTweet } from "@/hooks/tweet";
import DivisionBar from "@/shared/divisionbar";
import { useGlobalContext } from "@/context/globalContext";
import TweetPhotos from "./TweetPhotos";
import CommentPhotos from "./CommentPhotos";
import CommentDetail from "@/components/commentDetail/commentDetail";
import { useCurrentUser } from "@/hooks/user";
import { useGetCommentById } from "@/hooks/comment";

const PostPhotos = () => {
  const pathname = usePathname();

  const { showFullPhoto, setShowFullPhoto } = useGlobalContext();

  const idArr = pathname.split("/");

  const currentUrl = pathname.slice(0, pathname.length - 1);
  const id = idArr[idArr.length - 3];
  const photoNum = idArr[idArr.length - 1];

  const isComment = idArr[idArr.length - 4] === "comment";

  const { singleComment } = useGetCommentById(isComment ? id : "");
  const { singleTweet } = useGetSingleTweet(!isComment ? id : "");

  const post = isComment ? singleComment : singleTweet;

  const { user } = useCurrentUser();

  return (
    <div className="bg-black/80 h-screen">
      <div>
        <div className="w-full flex min-h-screen gap-1 h-auto">
          {isComment ? (
            <CommentPhotos
              currentUrl={currentUrl}
              photoNum={photoNum}
              showFullPhoto={showFullPhoto}
              setShowFullPhoto={setShowFullPhoto}
              tweet={post!}
              isComment={true}
            />
          ) : (
            <TweetPhotos
              currentUrl={currentUrl}
              photoNum={photoNum}
              showFullPhoto={showFullPhoto}
              setShowFullPhoto={setShowFullPhoto}
              tweet={post!}
            />
          )}

          <div className="">
            <DivisionBar type="y" />
          </div>
          {!showFullPhoto &&
            (isComment ? (
              <CommentDetail user={user!} commentId={post?.id} />
            ) : (
              <div className="overflow-y-auto h-screen">
                <PostDetail user={user!} postId={post?.id} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PostPhotos;
