const Comment=require("../model/comments")
const Post=require("../model/posts")
const mongoose=require("mongoose")
const { post } = require("../routes")
const User = require("../model/user_model")

const comments_mailer=require("../mailers/comments_mailer")

module.exports.create=async function(req,res){
    // console.log(req.body.post_id);
    try {
        const post=await Post.findOne({_id:req.body.post_id})

        const comment= await Comment.create({
            content:req.body.comment,
            user:req.user._id,
            post:req.body.post_id
        })

        const user=await User.findById(req.user._id);

        post.comments.push({
            comment:comment._id
        });
        await post.save();

        comments_mailer.newComment(user,comment);

        if(req.xhr){
            return res.status(200).json({
                data:{
                    comment
                },
                message:"Comment Created!",
                name:user.name
            })
        }

        req.flash('success','Comment Created!')
        return res.redirect("back");
        
    } catch (error) {
        req.flash('error',error)
        return res.redirect("back");
    }

}

module.exports.destroy=async(req,res)=>{

    try {
        const _id=req.params._id;
        const comment= await Comment.findOne({_id}) 

        const post=await Post.findOne({_id:comment.post})

        post.comments=post.comments.filter((c)=>{
            return c.comment!=_id;
        })
        await post.save();
        await comment.remove();

        if(req.xhr){
            return res.status(200).json({
                data:{
                    comment
                },
                message:"Comment deleted!"
            })
        }

        req.flash('success','Comment Deleted!')
        return res.redirect('back');

    } catch (error) {
        req.flash('error',error)
        return res.redirect('back');
    }

}