import { Socket } from "socket.io";
import { joinRoom, leaveRoom } from "./room";


export let onlineUsers:any=[]

export const addNewUser=(userId:string,socketId:string)=>{
 !onlineUsers.some((user:{userId:string,socketId:string})=>user.userId===userId)&&onlineUsers.push({userId,socketId})
}

export const removeUser=(socketId:string)=>{
  onlineUsers=onlineUsers.filter((user:{userId:string,socketId:string})=>user.socketId!==socketId)
}

export const getUser=(userId:string)=>{
  return onlineUsers.find((user:{userId:string,socketId:string})=>user.userId===userId)
}
export const handleEvents = (socket: Socket) => {
  console.log("hellow neema")

  socket.on("connectedUser", (userId: string,socketId:string) => {
    console.log("user got connencted...")
    addNewUser(userId,socketId)
    console.log(onlineUsers,"onlineUsersList")
  });

  socket.on("disconnectedUser", () => {
    console.log("user log disconnected")
    removeUser(socket.id)
  });

  socket.on("sendLikeNotification",({senderId,receiverId})=>{
    console.log(receiverId,"recieverid check")
    console.log(senderId," : senderID")
    const receiver=getUser(receiverId)
    console.log("receiver : ",receiver)
    if(!receiver){
      return
      
    }
    socket.to(receiver.socketId).emit("getLikeNotification",{
      senderId,
      msg:"user liked your post"
    })
  })


};
