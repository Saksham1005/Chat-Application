const mongoose=require("mongoose")
const multer=require("multer")
const path=require("path")
const AVATAR_PATH=path.join("/uploads/users/avatar")

const user_schema=new mongoose.Schema({
    user_email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    avatar:{
        type:String
    }
},{
    timestamps:true
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,"..",AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

user_schema.statics.uploadedAvatar=multer({storage}).single("avatar");
user_schema.statics.avatar=AVATAR_PATH;

const User=mongoose.model("User",user_schema);

module.exports=User