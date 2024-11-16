// context/SocketContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Create the context with a default value of null
const SocketContext = createContext<Socket | null>(null);

// Custom hook to access the socket context
export const useSocket = () => {
  console.log(SocketContext, "socket contgext");
  return useContext(SocketContext);
};

// The provider component that initializes the socket and provides it globally
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket only once
    const socketInstance = io("http://localhost:8000", {
      transports: ["websocket"], // Add transport option if needed
      // Optionally disable auto-reconnect for more control
      reconnection: false,
    });

    // Listen for the "connect" event
    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server", socketInstance.id);
      setSocket(socketInstance);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  useEffect(() => {
    if (socket) {
      console.log("socket is there");
      socket.on("likeTweet", (data) => {
        console.log(data, "like tweetio");
        // Handle the event, e.g., update the UI or state
      });
      console.log("socket is there and everywhere");

      return () => {
        socket.off("likeTweet");
      };
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
