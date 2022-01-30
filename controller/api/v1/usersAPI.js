const User=require("../../../model/user_model")
const jwt=require("jsonwebtoken")

module.exports.create_session=async(req,res)=>{
    try {
        const user=await User.findOne({user_email:req.body.user_email});
        
        if(!user || user.password != req.body.password){
            return res.json(422,{
                message:"Invalid Username/Password"
            })
        }

        return res.json(200,{
            message:"Sign In Successful, Please keep your token safe",
            data:{
                token:jwt.sign(user.toJSON(),'codeial',{expiresIn:'100000'})
            }
        })
    } catch (error) {
        return res.json(500,{
            message:"Internal Server Error"
        })
    }
}