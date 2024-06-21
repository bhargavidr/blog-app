const Post = require('../models/Post')
const Comment = require("../models/Comment")
const AuthLayer = {}


AuthLayer.post = async (req,res,next) => {
    const post = await Post.findOne({_id: req.params.id, author: req.user.id})
        if(post){
            next()
        }else{
            return res.status(403).json({Unauthorized:'You cannot access this page'})
        }     
}

AuthLayer.commentEdit = async (req,res,next) => {
    const comment = await Comment.findOne({_id: req.params.commentId, author: req.user.id})
    if (!comment){
        res.status(403).json({Unauthorized:'You cannot access this page'})
    }else{
        next()
    }
    
}

AuthLayer.commentDelete = async (req,res,next) => {
    const comment = await Comment.findById(req.params.commentId)
    const post = await Post.findById(req.params.postId)
    const stringifiedID = req.user.id.toString()
    if(comment.author.toString() === stringifiedID || post.author.toString() === stringifiedID){
        next()
    }else{        
        res.status(403).json({Unauthorized:'You cannot access this page'})
    }
    
}

module.exports = AuthLayer