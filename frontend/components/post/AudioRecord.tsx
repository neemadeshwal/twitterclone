import React, { useRef, useEffect } from "react";
import { TiMicrophoneOutline } from "react-icons/ti";

interface AudioRecordProps {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  tweetContent: string;
  setTweetContent: React.Dispatch<React.SetStateAction<string>>;
}

// Define type for SpeechRecognition
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

// Define types for speech recognition events
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

// Define the type for SpeechRecognition constructor
interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

// Extend the Window interface to include SpeechRecognition properties
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// Function to safely get the SpeechRecognition constructor
function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window !== "undefined") {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }
  return null;
}

const AudioRecord: React.FC<AudioRecordProps> = ({
  isRecording,
  setIsRecording,
  setTweetContent,
}) => {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isListeningRef = useRef<boolean>(false);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      console.log("Speech Recognition not working.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
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

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
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
  }, [setIsRecording]);

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
      <div className="">
        <div
          className={`${
            isRecording ? "bg-gray-900 record-indicator duration-300 " : ""
          } rounded-full w-fit z-[1000] p-2 hover:bg-[#081323] `}
        >
          <div
            onClick={() => setIsRecording((prevVal) => !prevVal)}
            className={` p-1 z-[10000] ${
              isRecording ? "bg-red-800 text-white " : " gray"
            } rounded-full cursor-pointer`}
          >
            <TiMicrophoneOutline
              className={`text-[22px] ${
                isRecording ? "text-gray-400" : "x-textcolor"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioRecord;
