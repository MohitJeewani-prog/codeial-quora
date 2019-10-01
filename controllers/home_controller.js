const Post = require('../models/post');

module.exports.home = function(req, res){

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

    //to populate posts with the user data(user is the one who posted)
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){
        //render ejs
        return res.render('home', {
            title:"Codeial | Home",
            posts: posts
        });
    })



}