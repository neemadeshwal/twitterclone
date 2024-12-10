"use client";

import { useCurrentUser } from "@/hooks/user";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useCurrentUser();

  useEffect(() => {
    const socketInstance = io("http://localhost:8000", {});

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server", socketInstance);
    });

    if (socketInstance) {
      console.log("hello check it if instance here.");

      setSocket(socketInstance);
    }
  }, []);

  useEffect(() => {
    if (socket && user) {
      socket.on("connect", () => {
        console.log("connected to socket io ")
        return socket.emit("connectedUser", user.id,socket.id);
      });
      socket.on("disconnect", () => {
        console.log("disconnected from socket io")

        return socket.emit("disConnectedUser");
      });

      return () => {
        socket.off("connect", () => {});
        socket.off("disconnect", () => {});
      };
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};