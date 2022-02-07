const Reset_Token=require("../model/reset_token");
const nodemailer=require("../config/nodemailer");

module.exports.change_password=(user)=>{
    let htmlString=nodemailer.renderTemplate({user},"./new_password.ejs");

    nodemailer.transporters.sendMail({
        from:"happygroup.mega@gmail.com",
        to:user.user_email,
        subject:"Change Password",
        html:htmlString
    },(err,info)=>{
        if(err){
            return console.log("Not sent password mail");
        }
        return console.log("Password mail sent");
    })
}