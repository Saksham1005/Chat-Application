const User=require("../model/user_model")
const Post=require("../model/posts")
const Comment=require("../model/comments")
const fs=require("fs")
const path=require("path")

module.exports.title_page=(req,res)=>{
    Post.find({})
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
    .exec(function(err,posts){
        if(err){
            console.log("Posts cannot be displayed");
            return;
        }

        else{
        // console.log(req.user.name);
            if(req.isAuthenticated()){
                // console.log("User is authenticated");
                User.find({},(err,users)=>{
                    if(err){
                        console.log("Error while finding the users"); 
                        return res.render("app_page.hbs",{
                        posts,
                        ouser:(req.user.id)
                        })
                    }
                    else
                    return res.render("app_page.hbs",{
                        posts,
                        ouser:(req.user.id),
                        all_users:users
                    })
                })
            }
            else{
                return res.render("app_page.hbs",{
                    posts
                })
            }
        }
    })
        
}

module.exports.user_sign_in=(req,res)=>{
    // console.log(req.cookies);
    if(req.isAuthenticated()){
        return res.redirect("/user/profile")
    }
    else
     return res.render("user_sign_in.hbs",{});
}

module.exports.user_sign_up=(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect("/user/profile");
    }
    else
     return res.render("user_sign_up.hbs",{});
}

module.exports.create=(req,res)=>{
    // console.log(req.body);
    if(req.body.password!=req.body.confirm_password){
        return res.redirect("back");
    }

    User.findOne({
        user_email:req.body.user_email,
    },(err,user)=>{
        if(err){
            console.log("Error in finding the user");
            return;
        }
        
        if(!user){
            User.create(req.body,(err,user)=>{
                if(err){
                    console.log("Error creating the user.")
                    // console.log(err)
                    return;
                }
                
                return res.redirect("/user/sign-in");
                
            })
        }
        else{
            req.flash('error','Duplicate User found!')
            return res.redirect("back");
        }
    })
}

module.exports.create_session=(req,res)=>{
    req.flash('success','Logged in successfully')
    return res.redirect("/")
}

module.exports.profile=(req,res)=>{
    // res.send("This is the profile page")
    if(!req.isAuthenticated()){
        return res.redirect("/user/sign-in");
    }
    else{
        const _id=req.params._id;
        User.findOne({_id},(err,user)=>{
            return res.render('profile.hbs',{profile_user:user});
        })
    }
}

module.exports.destroy_session=(req,res)=>{
        req.logout();
        req.flash('success','Logged out successfully')

        return res.redirect("/")
}

module.exports.update_user=async(req,res)=>{
    // User.findByIdAndUpdate(req.params.id,req.body,(err,user)=>{
    //     if(err){
    //         console.log("Cannot update the user!");
    //     }
    //     return res.redirect('back');
    // })
    if(req.user.id==req.params.id){
        let user=await User.findById(req.params.id);
        User.uploadedAvatar(req,res,async function(err){
            if(err){
                return console.log(err);
            }
            // req.body can be only accessed through multer middleware since its encryption type is 
            // multipart 
            user.name=req.body.name;
            user.params=req.body.user_email;

            if(user.avatar){
                fs.unlinkSync(path.join(__dirname,"..",user.avatar));
            }

            if(req.file){
                user.avatar=User.avatar+"/"+req.file.filename;
            }
            await user.save();
            return res.redirect('back');
        })
    }
    else{
        return res.status(401).send("Unauthorised");
    }
}


