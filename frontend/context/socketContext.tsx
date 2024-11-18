// context/SocketContext.tsx
"use client";

import { useCurrentUser } from "@/hooks/user";
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
  const { user } = useCurrentUser();
  // const checkToken = document.cookie
  //   .split(";")
  //   .find((row) => row.startsWith("token="));

  // const token = checkToken ? checkToken.split("=")[1] : "";
  useEffect(() => {
    const socketInstance = io("http://localhost:8000", {});
    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server", socketInstance);
    });

    if (socketInstance) {
      setSocket(socketInstance);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      const handleConnect = () =>
        socket.on("connect", () => {
          console.log("hello");
          return socket.emit("connectedUser", user?.id, (response: any) => {
            console.log("connecte the user in it/");
            console.log("successfully connected the user.", response);
          });
        });
      const handleDisconnect = () =>
        socket.on("disconnect", () => {
          return socket.emit("disconnectedUser", user?.id);
        });
      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      };
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
