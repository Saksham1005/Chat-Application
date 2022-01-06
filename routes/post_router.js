const express=require("express")
const router=express.Router()

const post_controller=require("../controller/post_controller")

router.post("/post/create",post_controller.create_post)

module.exports=router;