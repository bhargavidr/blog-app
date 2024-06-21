const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    content: { 
        type: String, 
        required: true 
    },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    post: { 
        type: Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true 
    },
    createdAt: { 
        type: Date, 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Comment = model('Comment', commentSchema);
module.exports = Comment;
