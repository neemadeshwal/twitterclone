import React, { useState } from "react";
import HashtagContainer from "../HashtagContainer";

const TweetContent = ({
  tweetContent,
  setTweetContent,
}: {
  tweetContent: string;
  setTweetContent: any;
}) => {
  const [isHashTagDialogOpen, setHashTagDialog] = useState(false);
  const [hashtagPart, setHashtagPart] = useState("");

  function handleContentChange(content: string) {
    const parts = content.split(/(\s|$)/);
    const lastPart = parts[parts.length - 1];

    if (lastPart && lastPart.startsWith("#")) {
      if (lastPart.length > 1) {
        setHashTagDialog(true);
        setHashtagPart(lastPart);
      } else {
        setHashTagDialog(false);
        setHashtagPart("");
      }
    } else {
      setHashTagDialog(false);
      setHashtagPart("");
    }
    setTweetContent(content);
  }
  return (
    <div>
      <div className="relative">
        <textarea
        
          value={tweetContent}
          onChange={(e) => handleContentChange(e.target.value)}
          rows={2}
          className={`text-[20px] resize-none bg-transparent   outline-none border-0 w-full placeholder:text-gray-600`}
          placeholder="What is happening?!"
        ></textarea>
        {isHashTagDialogOpen && (
          <div className="relative">
            <HashtagContainer
              content={hashtagPart}
              tweetContent={tweetContent}
              setTweetContent={setTweetContent}
              setHashTagDialog={setHashTagDialog}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetContent;
