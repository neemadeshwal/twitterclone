import { useState } from "react";
import DivisionBar from "@/shared/divisionbar";
import EditProfileContainer from "@/shared/editProfileContainer";
import { authorType, Like } from "@/graphql/types"; // Ensure Like is imported
import PostTab from "./postTab";
import CommentTab from "./commentTab";
import MediaTab from "./mediaTab";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import ProfileTabs, { TabType } from "./profileTabs";
import LikeTab from "./likesTab";

const ProfileDisplay = ({ user }: { user: authorType }) => {
  const [activeTab, setActiveTab] = useState<TabType>("post");
  const [editProfileDialog, setEditProfileDialog] = useState(false);

  const likedTweets = user.likedTweets
    .map((item) => {
      if (item.tweetId || item.commentId) {
        return item;
      }
      return undefined;
    })
    .filter((item): item is Like => item !== undefined); // Ensure only Like items are in the array

  const mediaPosts = user.posts.filter((post) => post.mediaArray.length > 0);

  const renderTabContent = () => {
    switch (activeTab) {
      case "post":
        return <PostTab postlist={user.posts} />;
      case "replies":
        return <CommentTab comment={user.commentTweets} />;
      case "likes":
        return <LikeTab postlist={likedTweets} />;
      case "media":
        return mediaPosts.length > 0 ? (
          <MediaTab mediaPost={mediaPosts} />
        ) : null;
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <div>
      <ProfileHeader
        user={user}
        onEditProfile={() => setEditProfileDialog(true)}
      />

      <div>
        <ProfileInfo user={user} />

        <div className="py-1">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <DivisionBar type="x" />
        </div>

        {renderTabContent()}
      </div>

      {editProfileDialog && (
        <EditProfileContainer
          user={user}
          editProfileDialog={editProfileDialog}
          setEditProfileDialog={setEditProfileDialog}
        />
      )}
    </div>
  );
};

export default ProfileDisplay;
