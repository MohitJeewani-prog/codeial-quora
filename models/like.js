const mongoose = require('mongoose');


const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,

    },
    
    //the object on which like has been placed
    likeable: {
        type: mongoose.Schema.ObjectId,
        required: true,

        //refPath indicates that this is a dynamic reference
        //because like can be on a post or a comment
        refPath: 'onModel'
    },
    //this field is used to define the type of the liked object
    //i.e it is a dynamic reference
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    }
}, {
    timestamps: true
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;