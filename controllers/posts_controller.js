//import post schema
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like')

module.exports.create = async function(req, res){

    try {

        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        //check if request is a AJAX request
        if(req.xhr){

            // if we want to populate just the name of the user (we'll not want to send the password in the API),
            // this is how we do it!
            post = await post.populate('user', 'name').execPopulate();


            //than return json
            return res.status(200).json({
                data: {
                    post: post,
                },
                message: "Post created!"
            });
        }
  
        req.flash('success', 'Post Published!');

        return res.redirect('back');
        
    } catch (err) {
        
        req.flash('error', err);

        // console.log("Error in creating the post", err);

        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){

    try {

        //first check the id of post
        let post = await Post.findById(req.params.id);

        //making sure only loged in user deletes the post
        //.id means converting the object id into string
        if(post.user == req.user.id){

            //delete the associated likes for the post
            await Like.deleteMany({
                likeable: post,
                onModel: 'Post'
            });
            
            //and all its comments' likes too
            await Like.deleteMany({
                _id: {
                    $in: post.comments
                }
            });

            post.remove();

            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted!"
                })
            }

            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
            
        }else{

            req.flash('error', 'You cannot delete this post');

            res.redirect('back');
        }
            
    } catch(err) {

        req.flash('err', err);
        
        // console.log('Error', err);
        
        res.redirect('back');
        
    }

}