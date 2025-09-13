const express=require("express")
const connectionRequestRouter=express.Router();
const {userAuth}=require("../middlewares/auth")
const ConnectionRequest=require("../models/connectionRequest");
const User = require("../models/User");

connectionRequestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const isToUserIdValid=await User.findById(toUserId);
        if(!isToUserIdValid){
            return res.status(400).send("Invalid request, user is not present is DB")
        }
        const validStatus=["ignored","interested"]
        if(!validStatus.includes(status)){
            return res.status(400).send("Invalid status")
        }

        const isValidRequest=await ConnectionRequest.findOne({
            $or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]
        })

        if(isValidRequest){
            return res.status(400).send("Connection requestion already exist..")
        }
        
        const newConnection=await ConnectionRequest({
            fromUserId,toUserId,status
        })
        await newConnection.save();
        res.send(newConnection)

    }
    catch(err){
        res.status(400).send(err.message)
    }
})

connectionRequestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user
        const {status,requestId}=req.params;
        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).send("Status is not valid")
        }
        const connectionRequest=await ConnectionRequest.findOne({_id:requestId,toUserId:loggedInUser._id,status:"interested"})
        if(!connectionRequest){
            return res.status(404).send("Connection request is not found")
        }
        connectionRequest.status=status;
        const data=await connectionRequest.save();
        res.status(200).json(
            {
                message:"Connection request "+status,
                data
            }
        )
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})

module.exports=connectionRequestRouter