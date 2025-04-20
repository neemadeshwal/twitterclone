import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";

const AudioRecord = ({
  isRecording,
  setIsRecording,
  tweetContent,
  setTweetContent,
}: {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  tweetContent: string;
  setTweetContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const recognitionRef = useRef<any>(null);

  const isListeningRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not working.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let appendedText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          appendedText += event.results[i][0].transcript + "";
        }
      }
      if (appendedText) {
        setTweetContent((prevVal) => prevVal + appendedText);
      }
    };

    recognition.onerror = (event: any) => {
      console.log("Speech recognition error");

      if (event.error === "no-speech") {
        if (isListeningRef.current) {
          recognition.stop();
          setTimeout(() => {
            recognition.start();
          }, 100);
        }
      } else {
        setIsRecording(false);
        isListeningRef.current = false;
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        recognition.start();
      } else if (isRecording) {
        setIsRecording(false);
      }
    };
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const startRecording = () => {
    setTweetContent("");
    setIsRecording(true);
    isListeningRef.current = true;

    recognitionRef.current?.start();
  };

  const stopRecording = () => {
    isListeningRef.current = false;
    recognitionRef.current?.stop();
  };
  return (
    <div>
      <div className="   ">
        <div
          className={`${
            isRecording ? "bg-gray-900  record-indicator duration-300 " : ""
          } rounded-full w-fit p-2  `}
        >
          <div
            onClick={() => setIsRecording((prevVal) => !prevVal)}
            className={`p-3   ${
              isRecording
                ? "bg-red-800 text-white "
                : " hover:bg-[#26262670] gray"
            } rounded-full cursor-pointer`}
          >
            <FaMicrophone className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioRecord;
