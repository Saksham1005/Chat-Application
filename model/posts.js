const mongoose=require("mongoose")

const post_schema=new mongoose.Schema({
    content:{
        type:String,
        required: true
    },
    user:{
        // referencing the user
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    comments:[
        {
            comment:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Comment"
            }
        }
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like'
        }
    ]
},{
    timestamps:true
})

const Post=mongoose.model("Post",post_schema)
module.exports=Post