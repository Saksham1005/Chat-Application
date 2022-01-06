const express=require("express")
const router=express.Router()

const user_router=require("./user_router")
const post_router=require("./post_router")

router.use(user_router);
router.use(post_router);

module.exports=router;
