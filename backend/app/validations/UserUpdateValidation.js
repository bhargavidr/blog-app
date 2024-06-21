
const Joi = require('joi')
const User = require('../models/User')

const userUpdate = Joi.object({
    username: Joi.string()
                .required(),

    email: Joi.string()
            .required()
            .email()
            .trim(true),

    bio: Joi.string()
            .allow('')
            .optional()
            .default('')
})

//custom validation for email
const validateAsync = async (value, userId) => {
    const user = await User.findOne({ email: value });
    // console.log(user, 'user custom validation');
    if (user._id.toString() != userId.toString()) {
        throw new Joi.ValidationError('Email already taken', [{
            message: 'Email already taken',
            type: 'string.email',
            path: ['email'],
            value,
        }]);
    }
};



//validators
const UserUpdateValidation = async(req,res,next) => {
    try {
        const { error, value } = userUpdate.validate(req.body, { abortEarly: false });
        if (error) {
            console.log(error, 'validation')
            return res.status(400).json(error);
        }
        await validateAsync(value.email, req.user.id);
        next();
    } catch (err) {
        console.log(err)
        return res.status(400).json(err);
    }
}


module.exports = UserUpdateValidation