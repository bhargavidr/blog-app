const Tag = require('../models/Tags')
const Post = require('../models/Post'); 

const tagCtrl = {}


tagCtrl.createTag = async (req, res) => {
    try {
        const { name, description,posts } = req.body;

        // Check if the tag already exists
        const tag = await Tag.findOne({ name });
        if (tag) {
            return res.status(400).json({ error: 'Tag already exists' });
        }

        const newTag = new Tag({
            name,
            description,
            posts
        });
        await newTag.save();
        res.status(201).json(newTag);

        if(posts.length > 0){
            posts.forEach(async (ele) => {
                const post = await Post.findById(ele._id)
                // console.log(post)
                post.tags.push(newTag._id)
                await post.save();
            })        
        }
    } catch (err) {
        console.error('Error creating tag:', err);
        res.status(500).json({ error: 'Something went wrong while creating the tag' });
    }
};


tagCtrl.getTags = async(req,res) => {
    try {
        const tags = await Tag.find()
        res.status(201).json(tags)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = tagCtrl