const Post=require("../../../model/posts")
const Comment=require("../../../model/comments")


module.exports.index=async function(req,res){

    let posts=await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'comment',
            populate:{
                path:'user'
            }
        }
    })

    posts.forEach(post => {
        post.user.password=undefined
    });

    return res.json({
        message:"Posts API controller",
        posts
    });
}



module.exports.destroy_post=async(req,res)=>{
    const _id=req.params._id;
    try {
        const post= await Post.findOne({_id}).populate({
            path:'comments',
            populate:{
                path:'comment',
            }
        })

        if(!post){
            console.log("No such Post found!");
            return res.json(400,{
                message:"No such Post found!"
            })
        }

        if(req.user.id==post.user){
            await Comment.deleteMany({post:post._id})

            await post.remove();

            return res.json(200,{
                message:"Posts and associated comments deleted!"
            })
        }
        else{
            return res.json(401,{
                message:"Unauthorised Request!"
            })
        }

    } catch (error) {
        return res.json(500,{
            message:"Internal Server Error"
        })
    }
}