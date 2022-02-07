const mongoose=require("mongoose")

const Schema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    accessToken:{
        type:String,
        required:true
    },
    isValid:{
        type:Boolean,
        required:true
    }
},{
    timestamps:true
});

const Reset_token=mongoose.model("Reset_token", Schema);

module.exports=Reset_token;
