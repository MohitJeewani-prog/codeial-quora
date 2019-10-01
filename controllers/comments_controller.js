const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){

    console.log("reached");

    //first find post id for the current comment
    Post.findById(req.body.post, function(err, post){

        console.log("reached");

        if(err){console.log("Not able to find post"); return;}

        //if post found
        if(post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){

                if(err){console.log('Error in creating comment'); return;}

                //update the post with comment
                post.comments.push(comment);
                post.save();

                ; res.redirect('/');
            });
        }
    });
}