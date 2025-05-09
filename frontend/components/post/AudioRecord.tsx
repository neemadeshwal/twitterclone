import React, { useRef, useEffect, useState } from "react";
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
  tweetContent,
}) => {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isListeningRef = useRef<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Track the last transcript to prevent duplicates
  const lastTranscriptRef = useRef<string>("");

  // Detect if user is on mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(
        userAgent
      );
    };

    setIsMobile(checkMobile());
  }, []);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      console.log("Speech Recognition not available.");
      return;
    }

    const recognition = new SpeechRecognition();

    // For mobile devices, don't use continuous mode to avoid repetition
    recognition.continuous = !isMobile;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();

        if (event.results[i].isFinal) {
          // For mobile, check if this is a duplicate of the last transcript
          if (isMobile && lastTranscriptRef.current === transcript) {
            continue;
          }

          // Add space only if needed
          const needsSpace =
            tweetContent.length > 0 &&
            !tweetContent.endsWith(" ") &&
            !transcript.startsWith(" ");

          currentTranscript += (needsSpace ? " " : "") + transcript;
          lastTranscriptRef.current = transcript;
        }
      }

      if (currentTranscript) {
        setTweetContent((prevVal) => prevVal + currentTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log("Speech recognition error:", event.error);

      if (event.error === "no-speech") {
        if (isListeningRef.current && !isMobile) {
          // For desktop, restart after a delay
          recognition.stop();
          setTimeout(() => {
            if (isListeningRef.current) {
              recognition.start();
            }
          }, 300);
        } else if (isMobile) {
          // For mobile, don't auto-restart to prevent loops
          setIsRecording(false);
          isListeningRef.current = false;
        }
      } else {
        setIsRecording(false);
        isListeningRef.current = false;
      }
    };

    recognition.onend = () => {
      // For mobile, only restart if explicitly recording
      if (isListeningRef.current && (!isMobile || (isMobile && isRecording))) {
        // Add a small delay before restarting on mobile
        setTimeout(
          () => {
            if (isListeningRef.current) {
              try {
                recognition.start();
              } catch (err) {
                console.log("Error restarting recognition:", err);
                setIsRecording(false);
                isListeningRef.current = false;
              }
            }
          },
          isMobile ? 300 : 50
        );
      } else if (isRecording) {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [setIsRecording, isMobile, tweetContent]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const startRecording = () => {
    setTweetContent("");
    lastTranscriptRef.current = ""; // Reset the last transcript
    setIsRecording(true);
    isListeningRef.current = true;

    try {
      recognitionRef.current?.start();
    } catch (err) {
      console.log("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    isListeningRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      console.log("Error stopping recording:", err);
    }
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
