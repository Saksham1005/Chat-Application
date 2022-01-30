const express=require("express")
const router=express.Router()
const v1Index=require("./v1/index")


router.use("/api",v1Index);

module.exports=router