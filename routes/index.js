const express=require("express")
const router=express.Router()

const user_router=require("./user_router")
const post_router=require("./post_router")
const comment_router=require("./comment_router")
const like_router=require("./like_router")
const friends_router=require("./friend_router")
const api=require("./api/index")

router.use(user_router);
router.use(post_router);
router.use("/comment",comment_router);
router.use(api);
router.use("/likes",like_router);
router.use("/friends", friends_router);

module.exports=router;
