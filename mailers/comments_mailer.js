const nodemailer=require("../config/nodemailer");
const User = require("../model/user_model");

// this is another way of exporting a method
exports.newComment=(user,comment)=>{

    let htmlString=nodemailer.renderTemplate({user,comment},'/new_comment.hbs');

    nodemailer.transporters.sendMail({
        from:'happygroup.mega@gmail.com',
        to:user.user_email,
        subject:"New comment Published",
        html:"gfhd"
    },(err,info)=>{
        if(err){
            return console.log("Error in sending mail",err)
        }
        return console.log("Message sent", info);
    })

}