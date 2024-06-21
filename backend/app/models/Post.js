const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { 
        type: Date, 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
    comments: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Comment' 
    }],
    tags: [{ 
        type: Schema.Types.ObjectId, 
        default:[],
        ref: 'Tag' 
    }],
    featuredImage: { 
        type: String 
    }
});

const Post = model('Post', postSchema);
module.exports = Post;
