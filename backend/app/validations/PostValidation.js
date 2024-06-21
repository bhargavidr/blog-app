const Joi = require('joi');

const post = Joi.object({
    title: Joi.string()
            .min(3)
            .max(100)
            .required(),

    content: Joi.string()
            .min(5)
            .required(),  

    // comments: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
    tags: Joi.array().optional().default([]),
    featuredImage: Joi.string().allow('')
});

const PostValidation = async(req,res,next) => {
    try {
        const { error, value } = post.validate(req.body, { abortEarly: false });
        if (error) {
            // console.log(error, 'validation')
            return res.status(400).json(error);
        }
        next()
    } catch (err) {
        return res.status(400).json(err);
    }
}

module.exports = PostValidation;
