const User=require("../model/user_model")

module.exports.title_page=(req,res)=>{
    res.render("app_page.hbs",{})
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
            return res.redirect("back");
        }
    })
}

module.exports.create_session=(req,res)=>{
    res.redirect("/user/profile")
}

module.exports.profile=(req,res)=>{
    // res.send("This is the profile page")
    if(!req.isAuthenticated()){
        return res.redirect("/user/sign-in");
    }
    else
    return res.render('profile.hbs',{})
    // if(req.cookies.chat_app){
    //     console.log(req.cookies.chat_app)
    //     User.findOne({_id:req.cookies.chat_app},(err,user)=>{
    //         if(err){
    //             return console.log("Error while fetching the user!");
    //         }
    //         if(!user){
    //             console.log("Unable to find the user!")
    //             return res.redirect("/user/sign-in")
    //         }
 
    //         return res.send({
    //             user_id:user.user_email
    //         });
    //     })
    // }
    // else{
    //     return res.redirect("/user/sign-in");
    // }
}

module.exports.destroy_session=(req,res)=>{
        // TODO later
        res.clearCookie("chat_app")
        res.redirect("/user/sign-in")
}