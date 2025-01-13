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

  socket.on("connectUserToServer", (userId: string) => {

    joinRoom(socket, userId)
  socket.emit("notify",{msg:"hello neema from backend"})

})

  socket.on("connectedUser", (userId: string,socketId:string) => {
    console.log("user got connencted...")
    joinRoom(socket,userId)
    
  });

  socket.on("disconnectedUser", (userId:string) => {
    leaveRoom(socket,userId)
  });


 


};














// socket.on("sendLikeNotification",({senderId,receiverId,socketId})=>{
//   console.log(receiverId,"recieverid check")
//   console.log(senderId," : senderID")
//   const receiver=getUser(receiverId)
//   console.log("receiver : ",receiver)
//   if(!receiver){
//     return
    
//   }
//   console.log(socketId,"socket id id")
//   console.log(receiver.socketId,"reciever socket id check..")
//   socket.emit("getLikeNotification",{
//     senderId,
//     receiverId,
//     msg:"user liked your post"
//   })
// })