const Post=require("../model/posts")
const Comment=require("../model/comments")
const User=require("../model/user_model")

module.exports.create_post=async(req,res)=>{
        try {
            if(!req.isAuthenticated()){
                return res.redirect('back');
            }
            const post=await Post.create({
                content:req.body.content,
                user:req.user._id
            })

            const user=await User.findById(req.user._id)
            
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post
                    },
                    message:"Post created!",
                    name:user.name
                })
                // return res.redirect("back");
            }
            else{
                // req.flash('success','Post Created!')
                return res.redirect("back");
            }
        }catch (err) {
            req.flash('error',err)
            return res.redirect("back");
        }    
}

module.exports.destroy_post=(req,res)=>{
    const _id=req.params._id;
    Post.findOne({_id}).populate({
        path:'comments',
        populate:{
            path:'comment',
        }
    }).exec(async function(err,post){
        if(err){
            req.flash('error',err)
            return res.redirect("back")
        }
        if(!post){
            console.log("post and its comments are not removed");
            req.flash('error','Post to be deleted not found!');

            return res.redirect("back")
        }

        else{
            // here we have to use req.user.id as we need object id as a string
            if(req.user.id==post.user){
                await Comment.deleteMany({post:post._id})

                await post.remove();

                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            post
                        },
                        message:"Post deleted!"
                    })
                }

            req.flash('success','Post and its associated Comments Deleted!')
            return res.redirect("back");
            }
            else{
            req.flash('error','Unauthorised Request!')
                
                return res.redirect("back");
            }
        }
    })
}