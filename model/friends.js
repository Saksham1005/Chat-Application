const mongoose=require("mongoose");

const Schema=new mongoose.Schema({
    from_user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    to_user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
},{
    timestamps:true
});

const Friends=mongoose.model('Friends',Schema);
module.exports=Friends;