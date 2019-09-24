const mongoose = require('mongoose');

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
    }
    
}, {
    timestamps:true
});

//telling that this schema is about user
const user = mongoose.model('User', userSchema);

module.exports = user;