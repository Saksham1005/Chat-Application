const Post=require("../model/posts")

module.exports.create_post=(req,res)=>{
        if(!req.isAuthenticated()){
            return res.redirect('back');
        }
        Post.create({
            content:req.body.content,
            user:req.user._id
        },(err,post)=>{
            if(err){
                console.log("Error while creating a post!");
                return;
            }
            return res.redirect("back");
        })
}