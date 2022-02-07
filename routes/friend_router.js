const express=require("express")
const router=express.Router()
const friends_controller=require("../controller/friends_controller")

router.post("/",friends_controller.friends);
router.post("/check-friend",friends_controller.check_friend);

module.exports=router;