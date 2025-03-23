import React, { useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
const EmojiTable = ({
  setIsEmojiTableOpen,
  isEmojiTableOpen,
  setTweetContent,
}: any) => {
  const emojiCloseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEmojiClose = (event: MouseEvent) => {
      if (
        emojiCloseRef.current &&
        !emojiCloseRef.current.contains(event.target as Node)
      ) {
        console.log("hey");
        setIsEmojiTableOpen(false);
      }
    };
    if (isEmojiTableOpen) {
      document.addEventListener("mousedown", handleEmojiClose);
    } else {
      document.removeEventListener("mousedown", handleEmojiClose);
    }

    return () => {
      document.removeEventListener("mousedown", handleEmojiClose);
    };
  }, [isEmojiTableOpen, setIsEmojiTableOpen]);
  return (
    <div>
      <div
        ref={emojiCloseRef}
        className="absolute bottom-0 md:top-[30%]  border rounded-[8px] border-gray-400  mx-[10%] z-[1000]"
      >
        <div>
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) =>
              setTweetContent((prevVal: string) => prevVal + emoji.native)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default EmojiTable;
