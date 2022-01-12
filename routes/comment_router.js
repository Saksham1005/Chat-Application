const express=require("express")
const router=express.Router()
const passport=require("passport")
const passportLocal=require("../config/passport")
const comment_controller=require("../controller/comment_controller")

router.post('/create',passport.checkAuthentication,comment_controller.create)

module.exports=router