import { Socket } from "socket.io";
import { joinRoom, leaveRoom } from "./room";

export const handleEvents = (socket: Socket) => {
  console.log("hey event function");
  socket.on("connectedUser", (userId: string) => {
    console.log(userId);
    joinRoom(socket, userId);
  });

  socket.on("disconnectedUser", (userId: string) => {
    leaveRoom(socket, userId);
  });
  // const users = {};

  // socket.on(
  //   "likeTweet",
  //   (tweetId: string, userId: string, authorId: string) => {
  //     console.log("User liked tweet", tweetId);
  //     console.log(`User ID: ${userId} liked tweet ${tweetId}`);

  //     // Here you can implement other logic related to liking the tweet if needed.
  //     // For example, you might check if the user is authorized, if the tweet exists, etc.

  //     // Example: emit notification to the author of the tweet
  //     socket.to(authorId).emit("tweetLiked", {
  //       message: `${userId} liked your tweet!`,
  //       tweetId,
  //     });
  //   }
  // );
};
