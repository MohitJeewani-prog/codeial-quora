const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

//import user from database
const User = require('../models/user');

//authantication using passport
//(basically finding the user and authanticating them)
passport.use(new LocalStrategy(
    {
    usernameField: 'email'
    },
    function(email, password, done){
        //find a user and establish the identity
        User.findOne({email: email}, function(err, user){
            if(err){
                console.log('Error in finding user ---> Passport');
                return done(err);
            }

            //user found
            if(!user || user.password != password){
                console.log("Invalid username password");
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

//serializing the user to decide which key is to be kept in cookies
//(basically sending data to cookie in the browser)
passport.serializeUser(function(user, done){
    //creates encrypted user id in browser
    done(null, user.id);
})


//deserializing the user from the key in the cookies
//(getting cookie data from the browser)
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    })
})

//check if the user is authenticated
passport.checkAuthentication = function(req, res, next){

    //if the user is signed in, then pass on the request to the next function(controllers action)
    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

//once user is signed in
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are
        //just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;