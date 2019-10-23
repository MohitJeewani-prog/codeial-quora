const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    //to populate posts with the user data(user is the one who posted)
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });

    return res.json(200, {
        message: "List of Posts",
        posts: posts
    })
}

module.exports.destroy = async function(req, res){

    try {

        //first check the id of post
        let post = await Post.findById(req.params.id);

        //making sure only loged in user deletes the post
        //.id means converting the object id into string
       if(post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});

            return res.json(200, {
                message: "post and associated comments deleted"
            });
        }else{

            return res.json(401, {
                message: "You cannot delete this post!"
            });

        }
            
    } catch(err) {

        res.json(500, {
             message: "Internal Server Error"
        });
        
    }

}