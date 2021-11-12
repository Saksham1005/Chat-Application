const express=require("express")
const router=express.Router()
const user_controller=require("../controller/user_controller")

router.get("/",user_controller.title_page)
router.get("/user/sign-in",user_controller.user_sign_in)
router.get("/user/sign-up",user_controller.user_sign_up)
router.post("/user/create",user_controller.create)

module.exports=router