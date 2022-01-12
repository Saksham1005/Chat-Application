const express=require("express")
const router=express.Router()

const user_router=require("./user_router")
const post_router=require("./post_router")
const comment_router=require("./comment_router")

router.use(user_router);
router.use(post_router);
router.use("/comment",comment_router);

module.exports=router;
