const express=require("express")
const { userAuth } = require("../middlewares/auth");
const User = require("../models/User");
const Message=require("../models/Message")
const { cloudinary } = require("../utils/cloudinary");
const messageRoutes=express.Router()
const ConnectionRequest=require("../models/connectionRequest")

// messageRoutes.post("/message/:id", userAuth, async (req, res) => {
//   try {
//     const receiverId = req.params.id;
//     const senderId = req.user._id;
//     let { text, image } = req.body;

//     if (!senderId) {
//       return res.status(401).json({ message: "Sender id is not valid" });
//     }

//     const receiverUser = await User.findById(receiverId);
//     if (!receiverUser) {
//       return res.status(404).json({ message: "Receiver id is not valid" });
//     }

//     if (!text) {
//       return res.status(400).json({ message: "Invalid message: text is required" });
//     }

//     if (image) {
//       const result = await cloudinary.uploader.upload(image);
//       image = result.secure_url;
//     }

//     const message = await Message.create({
//       text,
//       image,
//       senderId,
//       receiverId,
//     });

//     return res.status(200).json({
//       message: `Message sent successfully to ${receiverUser.firstName}`,
//       data: message,
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });


messageRoutes.post("/message/:id", userAuth, async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    let { text, image } = req.body;

    if (!senderId) return res.status(401).json({ message: "Sender id is invalid" });
    const receiverUser = await User.findById(receiverId);
    if (!receiverUser) return res.status(404).json({ message: "Receiver not found" });
    if (!text && !image) {
      return res.status(400).json({ message: "Message text or image is required" });
    }

    const isConnected = await ConnectionRequest.exists({
      status: "accepted",
      $or: [
        { fromUserId: senderId, toUserId: receiverId },
        { fromUserId: receiverId, toUserId: senderId },
      ],
    });
    if (!isConnected) {
      return res.status(403).json({ message: "You are not connected to this user, cannot send message" });
    }

    if (image) {
      const result = await cloudinary.uploader.upload(image);
      image = result.secure_url;
    }

    const message = await Message.create({ text, image, senderId, receiverId });

    return res.status(200).json({
      message: `Message sent successfully to ${receiverUser.firstName}`,
      data: message,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


// messageRoutes.get("/message/recieved/:id",userAuth,async(req,res)=>{
//     try{

//         const receiverId = req.params.id;
//         const senderId = req.user._id;

//          const messages = await Message.find({
//             $or: [
//             { senderId: senderId, receiverId: receiverId },
//             { senderId: receiverId, receiverId: senderId }
//         ]
//         }).sort({ createdAt: 1 });

//         return res.status(200).json({ messages });

        
//     }
//     catch(err){
//         console.error(err);
//         return res.status(500).json({ message: "Server Error: issue in fetching message" });
        
//     }
// })


messageRoutes.get("/message/recieved/:id", userAuth, async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    const isConnected = await ConnectionRequest.exists({
      status: "accepted",
      $or: [
        { fromUserId: senderId, toUserId: receiverId },
        { fromUserId: receiverId, toUserId: senderId },
      ],
    });
    if (!isConnected) {
      return res.status(403).json({ message: "You are not connected to this user, cannot view messages" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error: issue in fetching message" });
  }
});





module.exports=messageRoutes