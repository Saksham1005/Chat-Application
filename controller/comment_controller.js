const Comment=require("../model/comments")
const Post=require("../model/posts")
const mongoose=require("mongoose")

module.exports.create=function(req,res){
    // console.log(req.body.post_id);
    Post.findOne({_id:req.body.post_id},(err,post)=>{
        if(err || !post){return res.redirect("back");}

        else{
            Comment.create({
                content:req.body.comment,
                user:req.user._id,
                post:req.body.post_id
            },async function(err,comment){
                post.comments.push({
                    comment:comment._id
                });
                await post.save();

                return res.redirect("back");
            })
        }
    })
}