const mongoose=require("mongoose")

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["ignored","interested","accepted","rejected"],
        message:`{VALUE} is invalid status type`
    }
})

connectionRequestSchema.index({fromUserId:1,toUserId:1})

connectionRequestSchema.pre("save",function(next){
    const connectionRequestSchema=this
    if(connectionRequestSchema.fromUserId.equals(connectionRequestSchema.toUserId)){
        throw new Error("You can't send connection req to yourself")
    }
    next();

})

module.exports=mongoose.model("ConnectionRequest",connectionRequestSchema)