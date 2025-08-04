const express=require("express")
const TempUser = require("../models/TempUser")
const User = require("../models/User")
const authRoutes=express.Router()
const crypto=require("crypto")
const bcrypt=require("bcrypt")
const { sendVerificationEmail } = require("../utils/mailSender")
const jwt=require("jsonwebtoken")
const { cloudinary } = require("../utils/cloudinary")


authRoutes.post("/signup",async(req,res)=>{
    try{
        let {firstName, lastName, gender,email,password,photoUrl}=req.body
        if(!firstName||!lastName||!gender||!email||!password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(409).json({
                message:"User already exists, please login"
            })
        }

        await TempUser.deleteMany({ email });

        // const code =Math.floor(100000+Math.random()*900000).toString()
        const code = crypto.randomBytes(6).toString('hex');

        const hashedPassword = await bcrypt.hash(password, 10);

        if(photoUrl){
            const result = await cloudinary.uploader.upload(photoUrl);
            photoUrl= result.secure_url;
        }

        const tempUser=await TempUser.create({
            firstName,lastName,gender,email,password:hashedPassword,photoUrl,verificationCode:code,
            expiresAt: new Date(Date.now() + 10*60*1000)
        })
        await sendVerificationEmail(tempUser.email,tempUser.verificationCode)
        return res.status(200).json({ message: "Verification email sent." });
        
    }
    catch(err){
        return res.status(500).json({ message: `Issue while sending the verification code: ${err.message}` });
    }
})

authRoutes.post("/verifymail",async(req,res)=>{
    try{
        const {code}=req.body;
        if (!code) {
            return res.status(400).json({ message: "Verification code is required." });
        }
        const tempUser = await TempUser.findOne({
            verificationCode: code,
            expiresAt: { $gt: new Date() }
        });

        if(!tempUser){
            return res.status(400).json({ message: "Invalid or expired code." });
        }

        const existingUser = await User.findOne({ email: tempUser.email });
        if(existingUser){
            await TempUser.deleteOne({ _id: tempUser._id }); 
            return res.status(409).json({ message: "User already activated." });
        }

        
        const newUser = await User.create({
            firstName:tempUser.firstName,
            lastName:tempUser.lastName,
            gender:tempUser.gender,
            email: tempUser.email,
            password: tempUser.password,
            photoUrl:tempUser.photoUrl
        });

        await TempUser.deleteOne({ _id: tempUser._id });

        const token = jwt.sign({_id: newUser._id}, "Talkify@11", { expiresIn: "1d" });

        res.cookie("token",token,{expires: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)})

        return res.status(201).json({ message: "User verified and created!"});
    }
    catch(err){
        console.error("Verification error:", err);
        return res.status(500).json({
            message:"Issue while signing in"
        })
    }
})

authRoutes.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email||!password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        const existingUser = await User.findOne({ email });
        if(!existingUser){
            return res.status(409).json({
                message:"Invalid credentials"
            })
        }

        const isPasswordValid=await bcrypt.compare(password,existingUser.password);

        if(!isPasswordValid){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        const token = jwt.sign({ _id: existingUser._id }, "Talkify@11", { expiresIn: "1d" });

        res.cookie("token",token,{expires: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)})

        return res.status(201).json({ message: "User logged in successfully" });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: "Issue while logging in" });
    }
})


authRoutes.post("/logout",(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())})
    res.send("User logged out successfully")
})

module.exports=authRoutes