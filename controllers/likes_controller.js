// const Like = require('../models/like');
// const Post = require('../models/post');
// const Comment = require('../models/comment');

// module.exports.toggleLike = async function(req, res){
//     try {

//         //this controller is dealing with the following URL type
//         // likes/toggle/?id=abcdef&type=PostorComment

//         let likeable;
//         let deleted = false;

//         //than like is on a post
//         if(req.query.type == 'Post'){
//             likeable = await Post.findById(req.query.id).populate('likes')
//         }
//         //else like is on the comment
//         else{
//             likeable = await Comment.findById(req.query.id).populate('likes')
//         }

//         //check if a like already exists
//         let existingLike = await Like.findOne({
//             likeable: req.query.id,
//             onModel: req.query.type,
//             user: req.user._id
//         })

//         //if a like already exists then delete it
//         if(existingLike){

//             //first remove from array of likes inside post or comment
//             likeable.likes.pull(existingLike._id);
//             likeable.save();

//             //remove like generated from like schema
//             existingLike.remove();
//             deleted = true;
//         }
//         //create a new like
//         else{

//             let newLike = await Like.create({
//                 user: req.user._id,
//                 likeable: req.query.id,
//                 onModel: req.query.type
//             });

//             likeable.likes.push(like._id);
//             likeable.save();
//         }

//         return res.json(200, {
//             message: "Request successfull!",
//             data: {
//                 deleted: deleted
//             }
//         })
        
//     } catch (err) {
//         console.log(err);
//         return res.json(500, {
//             message: 'Internal Server Error'
//         });
//     }
// };

const Like = require("../models/like");
const Post =  require("../models/post");
const Comment = require('../models/comment');


module.exports.toggleLike = async function(req, res){
    try{

        // likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;


        if (req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }


        // check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        // if a like already exists then delete it
        if (existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;

        }else{
            // else make a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();

        }

        return res.json(200, {
            message: "Request successful!",
            data: {
                deleted: deleted
            }
        })



    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}