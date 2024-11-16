import { Socket } from "socket.io";
import { joinRoom, leaveRoom } from "./room";

export const handleEvents = (socket: Socket) => {
  socket.on(
    "likeTweet",
    (tweetId: string, userId: string, authorId: string) => {
      console.log(`User ${userId} liked tweet ${tweetId}`);
      socket.to(authorId).emit("tweetLiked", { tweetId, userId });
    }
  );
};
