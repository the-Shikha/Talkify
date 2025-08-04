const mongoose=require("mongoose")

const connectDb=async()=>{
    await mongoose.connect("mongodb+srv://shikhakumari152019:4QguvlF5vfpUr6Cw@cluster0.yzniubk.mongodb.net/Talkify")
}

module.exports=connectDb