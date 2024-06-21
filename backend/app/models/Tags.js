const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tagSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: { 
        type: String 
    },
    posts: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Post' 
    }]
});

const Tag = model('Tag', tagSchema);
module.exports = Tag;
