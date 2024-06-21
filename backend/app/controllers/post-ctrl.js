const Post = require('../models/Post'); 
const Tag = require('../models/Tags')
const User = require('../models/User')
const Comment = require('../models/Comment')
const mongoose = require('mongoose');

const postCtrl = {};


postCtrl.createPost = async (req, res) => {
    const { title, content, tags, featuredImage } = req.body;

    try {
        const post = new Post({ 
            title, 
            content, 
            author: req.user.id, 
            tags, 
            featuredImage,
            createdAt: new Date()
         });
        await post.save();

        // console.log(tags)
        if(tags.length > 0){
            tags.forEach(async (ele) => {
                const tag = await Tag.findById(ele._id)
                // console.log(tag)
                tag.posts.push(post._id)
                await tag.save();
            })        
        }
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

postCtrl.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', ['username','profilePicture']).populate('tags');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a post by postId
postCtrl.getOnePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id)
                                .populate('author', ['username','profilePicture'])
                                .populate('tags','name')
                                
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get posts by userId
postCtrl.getPostsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await Post.find({ author: userId }).populate('author', 'username').populate('tags','name');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//myposts
postCtrl.getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.id })
                                .populate('author',['username'])
                                .populate('tags','name');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get posts by tags
postCtrl.getPostsByTags = async (req, res) => {
    const { id } = req.params; 

    try {
        const posts = await Post.find({ tags: { $in: id } }).populate('tags','name').populate('author', 'profilePicture');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


postCtrl.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, tags, featuredImage } = req.body;

    try {
        const existingPost = await Post.findById(id);

        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const existingTagIds = existingPost.tags.map(tag => tag.toString());
        const newTagIds = tags.map(tag => tag._id.toString());

        // Find tags to be added and removed
        const tagsToAdd = newTagIds.filter(id => !existingTagIds.includes(id));
        const tagsToRemove = existingTagIds.filter(id => !newTagIds.includes(id));


        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, content, tags, featuredImage, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        for (const tagId of tagsToAdd) {
            const tag = await Tag.findById(tagId);
            if (tag) {
                tag.posts.push(updatedPost._id);
                await tag.save();
            }
        }

        // Handle tags to remove
        for (const tagId of tagsToRemove) {
            const tag = await Tag.findById(tagId);
            if (tag) {
                tag.posts = tag.posts.filter(postId => postId.toString() !== updatedPost._id.toString());
                await tag.save();
            }
        }
        
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a post
postCtrl.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPost = await Post.findByIdAndDelete(id, { new: true });
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if(deletedPost.tags.length > 0){
            deletedPost.tags.forEach(async (ele) => {
                const tag = await Tag.findByIdAndUpdate(ele._id, {$pull:{posts:id}})
                await tag.save();
            })        
        }
        // await comment = Comments.findOneAndDelete({post:postId})
        // await comment.save()

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




module.exports = postCtrl;
