const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

//sign in and createa session for the user
module.exports.createSession = async function(req, res){

    try {
        let user = await User.findOne({email : req.body.email});

        //if user not found or
        //password do not match
        if(!user || user.password != req.body.password){
            return res.json(422, {
                message: "Invalid Username or Password"
            })
        }

        //if user found than return json token
        return res.json(200, {
            message: "Sign in successfull, here is your token, please keep it safe",
            data : {

                //set the token and send it to the user
                token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '100000'})
            }
        });

    } catch (err) {
        
        console.log('******Error', err);
        
        res.json(500, {
            message: "Internal Server Error"
       });

    }
    
}
