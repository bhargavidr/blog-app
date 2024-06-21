const Joi = require('joi');

const editPost = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    comments: Joi.array().optional(),
    tags: Joi.array().optional().default([]),
    featuredImage: Joi.string().optional(),
});


const PostEditValidation = async(req,res,next) => {
    try {
        const { error, value } = editPost.validate(req.body, { abortEarly: false });
        if (error) {
            // console.log(error, 'validation')
            return res.status(400).json(error);
        }
        next()
    } catch (err) {
        return res.status(400).json(err);
    }
}


module.exports = PostEditValidation;
