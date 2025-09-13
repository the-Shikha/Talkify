// const socket=require("socket.io");
// const BASE_URL = require("./constant");

// const initializeSocket=(server)=>{
//     const io=socket(server,{
//         cors:{
//             origin:BASE_URL,
//             methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//             allowedHeaders: ["Content-Type", "Authorization"],
//             credentials: true
//         },
//     });
//     io.on("connection",(socket)=>{
//         //handle events
//         socket.on("joinChat",({senderId,receiverId})=>{
//             const roomId=[senderId,receiverId].sort().join("_");
//             console.log("Room id : ",roomId)
//             socket.join(roomId)
//         });
//         socket.on("sendMessage",({senderId,receiverId,text,image})=>{
//             const roomId=[senderId,receiverId].sort().join("_");
//             // console.log(text,image)
//             io.to(roomId).emit("messageRecieved",{senderId,text,image})
//         });
//         socket.on("disconnect",()=>{});
//     })
// }

// module.exports=initializeSocket


const socket = require("socket.io");
const ConnectionRequest = require("../models/connectionRequest");
const BASE_URL = require("./constant");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: BASE_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", async ({ senderId, receiverId }) => {
      try {
        const isConnected = await ConnectionRequest.exists({
          status: "accepted",
          $or: [
            { fromUserId: senderId, toUserId: receiverId },
            { fromUserId: receiverId, toUserId: senderId },
          ],
        });

        if (!isConnected) {
          return socket.emit("error", "You are not connected to join this chat");
        }

        const roomId = [senderId, receiverId].sort().join("_");
        //console.log("Room id: ", roomId);
        socket.join(roomId);
      } catch (err) {
        //console.error("Error in joinChat event:", err);
        socket.emit("error", "Internal server error on joinChat");
      }
    });

    socket.on("sendMessage", async ({ senderId, receiverId, text, image }) => {
      try {
        const isConnected = await ConnectionRequest.exists({
          status: "accepted",
          $or: [
            { fromUserId: senderId, toUserId: receiverId },
            { fromUserId: receiverId, toUserId: senderId },
          ],
        });

        if (!isConnected) {
          return socket.emit("error", "You are not connected to send messages");
        }

        const roomId = [senderId, receiverId].sort().join("_");
        io.to(roomId).emit("messageRecieved", { senderId, text, image });
      } catch (err) {
        //console.error("Error in sendMessage event:", err);
        socket.emit("error", "Internal server error on sendMessage");
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
