const express=require("express")
const router=express.Router()
const postsAPI=require("./posts");
const usersAPI=require("./users")

router.use("/v1/posts",postsAPI);
router.use("/v1/users",usersAPI);

module.exports=router