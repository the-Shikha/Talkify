const mongoose=require("mongoose")

const tempUserSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:18
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"],
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    photoUrl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWnW0NUpcrZcGZeUJ4e50ZLU8ugS9GPPoqww&s",
        required: true
    },
    about:{
        type:String,
        default:"This is the default about of the user"
    },
    
    verificationCode:{
        type:String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    expiresAt: {
    type: Date,
    required: true,
  },
},{timestamps:true})


module.exports=mongoose.model("TempUser",tempUserSchema)