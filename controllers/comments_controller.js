const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){

    try {
        
        //first find post id for the current comment
        let post = await Post.findById(req.body.post);

        //if post found
        if(post){
            let comment = await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
            });
        

            //update the post with comment
            post.comments.push(comment);
            post.save();

        if (req.xhr){
            // Similar for comments to fetch the user's id!
            comment = await comment.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: "Comment created!"
            });
        }

        req.flash('success', 'Comment published!');

        res.redirect('/');

        }    
    } catch (err) {

        console.log("Error", err);

        return;
        
    }

}

module.exports.destroy = async function(req, res){

    try {
       
        let comment = await Comment.findById(req.params.id);
        
        if(comment.user == req.user.id){

        //task: delete comment from post db and than delete comment

        //find post to which this comment belongs
        let postId = comment.post;

        comment.remove();

        let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
        
        // send the comment id which was deleted back to the views
        if (req.xhr){
            return res.status(200).json({
                data: {
                    comment_id: req.params.id
                },
                message: "Post deleted"
            });
        }

        //add flash
        req.flash('success', 'Comment deleted!');

        return res.redirect('back');
        
    }else{
        return res.redirect('back');
    } 
    } catch (err) {
        
        console.log("Error", err);
        return;
    }
    
}