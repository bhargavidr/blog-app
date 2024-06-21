const Joi = require('joi');

const commentSchema = Joi.object({
    //B - removed task Id and userId as it is not sent by the user. Check TaskCtrl.create - line 48
    content: Joi.string()
        .required()
        .trim(true)
        .min(1).message('Cannot add empty comment')
        .max(3000),
});


const CommentValidation = async (req, res, next) => {
    try {
        const { error, value } = commentSchema.validate(req.body, { abortEarly: false });
        if (error) {
            // console.log(error, 'validation');
            return res.status(400).json(error);
        }
        next()
    } catch (err) {
        return res.status(400).json(err);
    }
};

module.exports = CommentValidation;
