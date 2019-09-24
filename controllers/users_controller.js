//inport the database model
const User = require('../models/user');

module.exports.profile = function(req, res){

    // res.end('<h1>User Profile</h1>');

    return res.render('user_profile', {
        title:"Home"
    });

}

//render the sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}

//render the sign in page
module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

//get the sign up data
module.exports.create = function(req, res){
    
    //if password and confirm is not same
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    //finding email id in database
    User.findOne({email : req.body.email}, function(err, user){

        if(err){console.log('error in finding user in signing up'); return;}

        //if user not present
        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating the user'); return;}

                //redirect to sign-in controller
                return res.redirect('/users/sign-in');
            })
        }

        //else if user already present in the database than go back to sign up page
        else{
            return res.redirect('back');
        }

    });

}

//sign in and createa session for the user
module.exports.createSession = function(req, res){
    //TODO later
}