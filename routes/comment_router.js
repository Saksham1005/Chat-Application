const express=require("express")
const router=express.Router()
const passport=require("passport")
const passportLocal=require("../config/passport")
const comment_controller=require("../controller/comment_controller")

router.post('/create',passportLocal.checkAuthentication,comment_controller.create)
router.get('/destroy/:_id',passportLocal.checkAuthentication,comment_controller.destroy)

module.exports=router