const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true
    },
    email: { 
        type: String,
        required: true, 
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: {
        type: Date, 
        default: Date.now 
    },
    profilePicture: { 
        type: String 
    },
    bio: { 
        type: String,
        default: ''
    }
});

const User = model('User',userSchema)

module.exports = User