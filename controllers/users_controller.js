//inport the database model
const User = require('../models/user');

module.exports.profile = function(req, res){

    // res.end('<h1>User Profile</h1>');

    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title:"User Profile",
            profile_user: user
        });
    });

}

module.exports.update = function(req, res){

    //check if logged in user is real
    if(req.user.id == req.params.id){

        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            return res.redirect('back');
        });
    }
    //if someone is just fiddling with the account
    else{
        return res.status(401).send('Unauthorized');
    }
    
}

//render the sign up page
module.exports.signUp = function(req, res){

    //case when user is already signed in
    //than cannot visit sign in page and is redirected to profile page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}

//render the sign in page
module.exports.signIn = function(req, res){

    //case when user is already signed in
    //than cannot visit sign in page and is redirected to profile page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }

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

    req.flash('success', 'Logged in Successfully')

    return res.redirect('/');
}

module.exports.destroySession = function(req, res){

    req.flash('success', 'You have logged out')

    req.logout();

    return res.redirect('/');
}

