import React, { useEffect, useRef, useState } from "react";
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
  const textareaRef = useRef(null);

  // Effect to resize the textarea whenever tweetContent changes
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set the height to match the content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [tweetContent]);
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
            ref={textareaRef}
            value={tweetContent}
            autoFocus
            onChange={(e) => handleContentChange(e.target.value)}
            rows={1}
            className={`text-[15px] sm:text-[20px] resize-none overflow-hidden bg-transparent outline-none border-0 w-full placeholder:text-gray-600`}
            placeholder={
              isRecording && !tweetContent
                ? ""
                : isComment
                ? "Post Your Reply"
                : "What is happening?!"
            }
            style={{ minHeight: isInPhotoSection ? "24px" : "48px" }}
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
