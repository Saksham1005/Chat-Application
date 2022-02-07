const express=require("express");
const router=express.Router();
const passport=require("passport")
const passportLocal=require("../config/passport")


const like_controller=require("../controller/likes_controller");

router.post('/toggle',like_controller.toggleLike);

module.exports=router;