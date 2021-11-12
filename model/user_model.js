const mongoose=require("mongoose")

const user_schema=new mongoose.Schema({
    user_email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    }
},{
    timestamps:true
})

const User=mongoose.model("User",user_schema);

module.exports=User