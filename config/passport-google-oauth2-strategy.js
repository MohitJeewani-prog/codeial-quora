const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


//tell passport to use a new strategy for google login
passport.use(new googleStrategy(
    {
        clientID: "345615982330-ur1sf9itk3qqk4olveslkjormr10650d.apps.googleusercontent.com",
        clientSecret: "rFXa7bpuffe148wH3FNu7oFB",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done){
        //find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){console.log("Error in google-strategy passport", err); return;}

            console.log(accessToken, refreshToken);
            console.log(profile);

            if(user){
                //if found, set this user as req.user(i.e sign that user)
                return done(null, user);
            }else{
                //if user not found than create user and set it as req.user(i.e sign that user)
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                }, function(err, user){
                    if(err){console.log("Error in creating user", err); return;}
                    
                    return done(null, user);
                });
            }
        });
    }
));

module.exports = passport;