const nodemailer=require("nodemailer")
const hbs=require("hbs")
const path=require("path")

let transporters=nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:'happygroup.mega@gmail.com',
        pass:"happygroup@1006"
    }
});

let renderTemplate=(data,relativePath)=>{
    let mailHTML;
    hbs.renderFile(
        path.join(__dirname, "../views/mailers",relativePath),
        data,
        function(err,template){
            if(err){
                console.log("Error in rendering template");
                return;
            }
            mailHTML=template;
        }
    )
    return mailHTML;
}

module.exports={
    transporters,
    renderTemplate
}