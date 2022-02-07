const User=require("../model/user_model")
const Post=require("../model/posts")
const Reset_token=require("../model/reset_token")
// const Comment=require("../model/comments")
const fs=require("fs")
const path=require("path")

const change_password_mailer=require("../mailers/change_password_mailer");

module.exports.title_page=async(req,res)=>{
    let user;
    if(req.isAuthenticated()){
        user=await User.findOne({_id:req.user._id}).populate({
            path:'friends',
            populate:{
                path:"to_user"
            }
        });
    }

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
            if(req.isAuthenticated()){
                // console.log("User is authenticated");
                User.find({},(err,users)=>{
                    if(err){
                        console.log("Error while finding the users"); 
                        return res.render("app_page.ejs",{
                        posts
                        })
                    }
                    else{
                        // console.log(users);
                    return res.render("app_page.ejs",{
                        posts,
                        all_users:users,
                        user
                    })
                    }
                })

            }
            else{
                return res.render("app_page.ejs",{
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
     return res.render("user_sign_in.ejs",{});
}

module.exports.user_sign_up=(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect("/user/profile");
    }
    else
     return res.render("user_sign_up.ejs",{});
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
            return res.render('profile.ejs',{profile_user:user});
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

// For route 1
module.exports.forgot_password=async(req,res)=>{
    return res.render("forgot_password.ejs",{
        
    })
};


// Route 2 for sending email with user_email in body
module.exports.change_password_email=async(req,res)=>{

    try {
        const user=await User.findOne({user_email:req.body.user_email});
        if(!user){
            return res.redirect("/user/sign-in");
        }
        // send the email
        change_password_mailer.change_password(user);
        return res.redirect("/user/sign-in");
        
    } catch (error) {
        console.log(error);
        return res.redirect("/user/sign-in");
    }
};

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
    }
    return result;
}

// route 3 for sending user to final change password form
module.exports.change_password=async(req,res)=>{
    try {
        // console.log(req.body.user._id);
        const reset_token=await Reset_token.create({
            user:req.body.user,
            accessToken: makeid(10),
            isValid:true
        })
        // req.body.reset_token=reset_token;
        return res.render("change_password.ejs",{
            reset_token,
            user:req.body.user
        })

    } catch (error) {
        console.log(error);
        return console.log("Unable to send the user to final change password form");
    }

}

// route 4
module.exports.change_password_auth=async(req,res)=>{
    if(req.body.password!=req.body.confirm_password){
        return res.redirect("back");
    }
    try {
        const reset_token=await Reset_token.findOne({accessToken:req.body.reset_token_access});
        reset_token.isValid=false;
        await reset_token.save();
    } catch (error) {
        return console.log("Unable to change the password!")
    }
// console.log(req.body.password);
    User.findOne({_id:req.body.user},async(err,user)=>{
        if(err){
            return console.log("Error in finding the user!")
        }
        user.password=req.body.password;
        await user.save();
        return res.redirect("/user/sign-in");
    });
}


