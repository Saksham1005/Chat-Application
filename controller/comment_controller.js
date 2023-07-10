const Comment = require("../model/comments");
const Post = require("../model/posts");
const Like = require("../model/like");
// const mongoose=require("mongoose")
// const { post } = require("../routes")
// const User = require("../model/user_model")

// const comments_mailer=require("../mailers/comments_mailer")
// const queue=require("../config/kue");
// const commentEmailWorker=require('../workers/comment_email_worker');

module.exports.create = async function (req, res) {
  // console.log(req.body.post_id);
  try {
    // console.log("comment creation!")
    const post = await Post.findOne({ _id: req.body.post_id });

    // Comment.create(...).populate(...) is not a function
    let comment = await Comment.create({
      content: req.body.comment,
      user: req.user._id,
      post: req.body.post_id,
    });

    comment = await Comment.findOne(comment).populate({
      path: "user",
    });

    // console.log(comment);

    post.comments.push({
      comment: comment._id,
    });
    await post.save();

    // Not sending comment mails

    // comments_mailer.newComment(comment);
    // let job=queue.create('emails',comment).save(function(err){
    //     if(err){
    //         return console.log("Error in sending to the queue", err);
    //     }

    //     console.log("job enqueued", job.id);

    // });

    if (req.xhr) {
      return res.status(200).json({
        data: {
          comment,
        },
        message: "Comment Created!",
      });
    }

    req.flash("success", "Comment Created!");
    return res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    return res.redirect("back");
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const _id = req.params._id;
    // console.log(_id);
    let comment = await Comment.findOne({ _id });

    // console.log("comment -\n"+comment);
    // console.log("post id\n"+comment.post+"\n\n");
    const post = await Post.findOne({ _id: comment.post });

    post.comments = post.comments.filter((c) => {
      return c.comment != _id;
    });

    await post.save();

    comment.likes = comment.likes.forEach(async function (like_id) {
      const like = await Like.findById(like_id);
      await like.remove();
    });

    comment = await comment.remove();
    // console.log(comment);
    if (req.xhr) {
      return res.status(200).json({
        data: {
          comment,
        },
        message: "Comment deleted!",
      });
    }

    req.flash("success", "Comment Deleted!");
    return res.redirect("back");
  } catch (error) {
    // console.log("Unable to delete comment!")
    console.log(error);
    req.flash("error", error);
    return res.redirect("back");
  }
};
