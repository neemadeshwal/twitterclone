import React, { useState } from "react";
import HashtagContainer from "../HashtagContainer";

const TweetContent = ({
  tweetContent,
  setTweetContent,
  isComment,
  isInPhotoSection,
  isRecording,
}: {
  tweetContent: string;
  setTweetContent: any;
  isComment?: boolean;
  isInPhotoSection?: boolean;
  isRecording: boolean;
}) => {
  const [isHashTagDialogOpen, setHashTagDialog] = useState(false);
  const [hashtagPart, setHashtagPart] = useState("");
  const [isListening, setIsListening] = useState(false);

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
        {isRecording && !tweetContent && (
          <div>
            <div>
              {" "}
              <div className="inline-flex items-center gap-1 px-4 py-2 pt-4  rounded-2xl">
                <div className="w-2 h-2 bg-gray-500 rounded-full opacity-40 animate-[pulse_1.2s_ease-in-out_infinite]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full opacity-40 animate-[pulse_1.2s_ease-in-out_0.2s_infinite]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full opacity-40 animate-[pulse_1.2s_ease-in-out_0.4s_infinite]"></div>
              </div>
            </div>
          </div>
        )}

        {
          <textarea
            value={tweetContent}
            autoFocus
            onChange={(e) => handleContentChange(e.target.value)}
            rows={isInPhotoSection ? 1 : 2}
            className={` text-[15px] sm:text-[20px] resize-none overflow-visible bg-transparent   outline-none border-0 w-full placeholder:text-gray-600`}
            placeholder={
              isRecording && !tweetContent
                ? ""
                : isComment
                ? "Post Your Reply"
                : "What is happening?!"
            }
          ></textarea>
        }

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
