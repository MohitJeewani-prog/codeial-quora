const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');

const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
    
}, {
    timestamps:true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
})


//static methods
userSchema.statics.uploadedAvatar =  multer({storage: storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;


//this method ensures that while return user data as json object
//password field is not visible
userSchema.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.password;
    return obj; 
}


//telling that this schema is about user
const user = mongoose.model('User', userSchema);

module.exports = user;