const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){

    // //req.cookies gets the value of the cookie
    // console.log(req.cookies); 

    // // to change the cookie received from the browser
    // res.cookie('user_id', 25);

    // Post.find({}, function(err, posts){
    //     //render ejs
    //     return res.render('home', {
    //         title:"Codeial | Home",
    //         posts: posts
    //     });
    // });

    try {

        //to populate posts with the user data(user is the one who posted)
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        }).populate('likes');

        let users = await User.find({});

        //render ejs
        return res.render('home', {
            title:"Codeial | Home",
            posts: posts,
            all_users: users
        });

            
        }catch (err){
            console.log('Error', err);
            return;
        }

}