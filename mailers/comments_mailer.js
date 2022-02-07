const nodemailer=require("../config/nodemailer");
const User = require("../model/user_model");

// this is another way of exporting a method
exports.newComment=(comment)=>{

    let htmlString=nodemailer.renderTemplate({comment},'/new_comment.ejs');

    nodemailer.transporters.sendMail({
        from:'happygroup.mega@gmail.com',
        to:comment.user.user_email,
        subject:"New comment Published",
        html:htmlString
    },(err,info)=>{
        if(err){
            return console.log("Error in sending mail",err)
        }
        // console.log(info);
        
        return console.log("Message sent");
    })

}