import React, { useState, useEffect, useRef } from "react";

const InstructionAwareRecorder = ({
  onTranscriptionComplete,
}: {
  onTranscriptionComplete: (text: string) => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const isListeningRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let newTranscript = transcriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newTranscript += event.results[i][0].transcript + " ";
        }
      }

      transcriptRef.current = newTranscript;
      setTranscript(newTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
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
        recognition.start(); // Restart if listening
      } else if (isRecording) {
        setIsRecording(false);
        onTranscriptionComplete(transcriptRef.current);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isRecording, onTranscriptionComplete]);

  const startRecording = () => {
    setTranscript("");
    transcriptRef.current = "";
    setIsRecording(true);
    isListeningRef.current = true;

    recognitionRef.current?.start();
  };

  const stopRecording = () => {
    isListeningRef.current = false;
    recognitionRef.current?.stop();
  };

  return (
    <div className="voice-recorder">
      <div className="status-indicator">
        {isRecording ? (
          <div className="recording-status">
            <span className="recording-dot" /> Recording...
          </div>
        ) : (
          <span>Click to start recording</span>
        )}
      </div>

      <div className="button-container">
        {!isRecording ? (
          <button onClick={startRecording} className="record-button">
            Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} className="stop-button">
            Stop Recording
          </button>
        )}
      </div>

      {transcript && (
        <div className="live-transcript">
          <h4>Current Transcript:</h4>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default InstructionAwareRecorder;
