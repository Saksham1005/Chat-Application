const express=require("express")
const router=express.Router()
const user_controller=require("../controller/user_controller")
const passport=require("passport")
const passportLocal=require("../config/passport")

router.get("/",user_controller.title_page)
router.get("/user/sign-in",user_controller.user_sign_in)
router.get("/user/sign-up",user_controller.user_sign_up)
router.post("/user/create",user_controller.create)
router.post("/user/create-session",passport.authenticate(
    'local',
    {failureRedirect: '/user/sign-in'}
),user_controller.create_session);

router.get("/user/profile",passportLocal.checkAuthentication,user_controller.profile)
router.get("/user/sign-out",user_controller.destroy_session)

module.exports=router