const express=require("express")
const { userAuth } = require("../middlewares/auth");
const User = require("../models/User");
const { cloudinary } = require("../utils/cloudinary");
const profileRoutes=express.Router()

profileRoutes.get("/profile",userAuth,async(req,res)=>{
    try{
        const { password, __v, ...safeUser } = req.user.toObject();
        return res.status(200).json({
            message:"User fetched successfully",
            data:safeUser
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Issue while fetching user profile"
        })
    }
})

profileRoutes.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const { firstName, lastName, gender, photoUrl } = req.body;

        const toUpdate = {};
        if (firstName !== undefined) toUpdate.firstName = firstName;
        if (lastName !== undefined) toUpdate.lastName = lastName;
        if (gender !== undefined) toUpdate.gender = gender;
        if (photoUrl !== undefined) {
            const result = await cloudinary.uploader.upload(photoUrl);
            toUpdate.photoUrl= result.secure_url;
        }

        const updateUser = await User.findByIdAndUpdate(
            loggedInUser._id,
            toUpdate,
            { new: true }
        );

        if (!updateUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password, __v, ...safeUser } = updateUser.toObject();
        return res.status(200).json({
            message: "User updated successfully",
            data: safeUser
        });

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Issue while updating user profile"
        })
    }
})

profileRoutes.get("/profile/getAllUsers",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user
        const allUsers = await User.find({ _id: { $ne: loggedInUser._id } },"-password -__v");
        return res.status(200).json({
            message:"All user fetched successfully",
            data:allUsers
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Issue while fetching all the user profiles"
        })
    }
})



module.exports=profileRoutes