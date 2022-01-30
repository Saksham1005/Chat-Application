const express=require("express")
const router=express.Router()
const usersAPIController=require("../../../controller/api/v1/usersAPI")

router.post("/create-session",usersAPIController.create_session);

module.exports=router;
