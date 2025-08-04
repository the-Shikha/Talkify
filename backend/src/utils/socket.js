const socket=require("socket.io");
const BASE_URL = require("./constant");
const initializeSocket=(server)=>{
    const io=socket(server,{
        cors:{
            origin:BASE_URL,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        },
    });
    io.on("connection",(socket)=>{
        //handle events
        socket.on("joinChat",({senderId,receiverId})=>{
            const roomId=[senderId,receiverId].sort().join("_");
            console.log("Room id : ",roomId)
            socket.join(roomId)
        });
        socket.on("sendMessage",({senderId,receiverId,text,image})=>{
            const roomId=[senderId,receiverId].sort().join("_");
            // console.log(text,image)
            io.to(roomId).emit("messageRecieved",{senderId,text,image})
        });
        socket.on("disconnect",()=>{});
    })
}

module.exports=initializeSocket