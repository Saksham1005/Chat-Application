const mongoose=require("mongoose");

const Schema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:"onModel"
    },
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    }
},{
    timestamps:true
});

const Like=mongoose.model('Like',Schema);
module.exports=Like;