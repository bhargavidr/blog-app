const Comment = require('../models/Comment'); // Adjust the path as necessary
const Post = require('../models/Post'); // Adjust the path as necessary


const commentCtrl = {};

commentCtrl.createComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = new Comment({ 
            content, 
            author : req.user.id,
            post: postId,
            createdAt:new Date()
        });

        await comment.save();

        post.comments.push(comment._id); //can you do something similar for delete?? check 
        await post.save();

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


commentCtrl.getCommentsByPost = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ post: postId }).populate('author', ['username','profilePicture']);
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


commentCtrl.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const updatedComment = await Comment.findByIdAndUpdate(commentId, { content, updatedAt: new Date() }, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


commentCtrl.deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        await Post.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } }); 
    

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = commentCtrl;
