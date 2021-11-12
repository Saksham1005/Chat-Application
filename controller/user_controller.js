const User=require("../model/user_model")

module.exports.title_page=(req,res)=>{
    res.send("Loaded the first page")
}

module.exports.user_sign_in=(req,res)=>{
    // console.log(req.cookies);
    res.cookie("user_id","25")
    res.render("user_sign_in.hbs",{})
}

module.exports.user_sign_up=(req,res)=>{
    res.render("user_sign_up.hbs",{})
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