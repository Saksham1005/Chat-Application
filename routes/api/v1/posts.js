const express=require("express")
const router=express.Router()
const postsAPIController=require("../../../controller/api/v1/postsAPI")
const passport=require("passport")

router.get("/",postsAPIController.index);
router.delete("/:_id",passport.authenticate('jwt',{session:false}),postsAPIController.destroy_post);

module.exports=router