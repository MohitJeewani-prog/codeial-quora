//this whole procedure is used once the user is logged in and a jwt has been 
//generated for that user
//this method now authanticates the user during session using jwt

const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');

//import user from database
const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret,
}


//@params -> jwtPayload is header.payload.signature which is way of encryption
passport.use(new JWTStrategy(
    opts,
    function(jwtPayload, done){
         
        User.findById(jwtPayload._id, function(err, user){
            if(err){console.log('Error in finding user from JWT'); return;}

            //if user is found
            if(user){
                return done(null, user);
            }else{
                return done(null, false);
            }
        });
    }
));

module.exports = passport;