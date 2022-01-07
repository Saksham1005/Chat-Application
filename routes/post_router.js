const express=require("express")
const router=express.Router()
const passport=require("passport")
const passportLocal=require("../config/passport")

const post_controller=require("../controller/post_controller")

router.post("/post/create",passportLocal.checkAuthentication,post_controller.create_post)

module.exports=router;