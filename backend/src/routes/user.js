const express=require("express")
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { connect } = require("mongoose");
const User = require("../models/User");

const USER_SAFE_DATA="firstName lastName age gender skills photoUrl about"

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
                toUserId:loggedInUser._id,
                status:"interested"
        }).populate("fromUserId",["firstName","lastName","photoUrl","about","age","gender","about"])
        res.json({
            message:"Connection requests fetched successfully",
            data:connectionRequests
        })
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connections=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser,status:"accepted"},
                {toUserId:loggedInUser,status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

        const data=connections.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId
            }
            else{
               return row.fromUserId
            }
        })
        res.send({data})
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const page=req.query.page||1;
        let limit=req.query.limit||10
        limit=limit>50?50:limit
        const skip=(page-1)*limit;
        const loggedInUser=req.user;
        const connectedUser=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId").populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

        const hideFeed=new Set();
        connectedUser.forEach((req)=>{
            hideFeed.add(req.fromUserId)
            hideFeed.add(req.toUserId)
        })
        const user=await User.find({
            $and:[
                {_id:{$ne:loggedInUser._id}},
                {_id:{$nin:Array.from(hideFeed)}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.status(200).send(user)
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})

module.exports=userRouter;