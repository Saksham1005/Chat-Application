const User=require("../model/user_model")
const Friends=require("../model/friends");
const { query } = require("express");
// const ObjectId=require("mongoose").Schema.Types.ObjectId;

module.exports.friends=async(req,res)=>{
// add friend otherwise remove friend
    try {
        let friend=await Friends.findOne({
            from_user:req.user._id,
            to_user:req.query._id
        })

        query_friend=await Friends.findOne({
            to_user:req.user._id,
            from_user:req.query._id
        });
        
        // if(!friend)
        // friend=await Friends.findOne({
        //     to_user:req.user._id,
        //     from_user:req.query.id
        // })

        const user=await User.findById(req.user._id).populate({
            path:"friends"
        });
        // console.log(user)
        const query_user=await User.findById(req.query._id).populate({
            path:"friends"
        });

        if(!friend){
            friend=await Friends.create({
                from_user:req.user._id,
                to_user:req.query._id
            });

            query_friend=await Friends.create({
                to_user:req.user._id,
                from_user:req.query._id
            });
        // console.log(friend);
        
            user.friends.push(friend._id);
            await user.save();
            
            //pushing query user 
            query_user.friends.push(query_friend._id);
            await query_user.save();
            
            return res.status(200).json({
                message:"Friend added",
                id:req.query._id
            })
        }

        else{
            user.friends.pull(friend._id);
            await user.save();
            await friend.remove();

            query_user.friends.pull(query_friend._id);
            await query_user.save();
            await query_friend.remove();

            return res.status(200).json({
                message:"Friend Deleted",
                id:req.query._id
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
    
}


module.exports.check_friend=async(req,res)=>{
    try {
        const friend=await Friends.findOne({
            from_user:req.user._id,
            to_user:req.query._id
        });

        if(!friend){
            return res.status(200).json({
                message:"Friend not found"
            })
        }
        return res.status(200).json({
            message:"Friend found"
        })

    } catch (error) {
        console.log(error.responseText);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}