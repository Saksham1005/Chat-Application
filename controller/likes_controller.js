const Like=require("../model/like");
const Post=require("../model/posts")
const Comment=require("../model/comments")

module.exports.toggleLike=async(req,res)=>{

    try {
        if(!req.isAuthenticated()){
            return res.status(401).json({
                message:"Invalid User"
            })
        }
        let likeable;
        let deleted=false;
        // Route - /likes/toggle?id=abc&type=Post
        // console.log(req.query.type);
        if(req.query.type=="Post"){
            likeable=await Post.findById(req.query.id).populate('likes');
        }else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }
    // console.log(likeable);
        let existingLike=await Like.findOne({
            user:req.user._id,
            likeable:req.query.id,
            onModel:req.query.type
        })
        
        if(existingLike){
            deleted=true;
            likeable.likes.pull(existingLike._id);
            await likeable.save();
            await existingLike.remove();
        }else{
            const like=await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            })
            likeable.likes.push(like._id);
            await likeable.save();
        }

        return res.status(200).json({
            message:"Request Successfull",
            data:{
                deleted
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
    

}