
const Joi = require('joi')
const User = require('../models/User')

const register = Joi.object({
    username: Joi.string()
                .required(),

    email: Joi.string()
            .required()
            .email()
            .trim(true),

    passwordHash:Joi.string()
                .min(8)
                .max(128)
                .required(),
                
})

//custom validation for email
const validateAsync = async (value) => {
    const user = await User.findOne({ email: value });
    // console.log(user, 'user custom validation');
    if (user) {
        throw new Joi.ValidationError('Email already taken', [{
            message: 'Email already taken',
            type: 'string.email',
            path: ['email'],
            value,
        }]);
    }
};



//validators
const RegisterValidation = async(req,res,next) => {
    try {
        const { error, value } = register.validate(req.body, { abortEarly: false });
        if (error) {
            // console.log(error, 'validation')
            return res.status(400).json(error.details);
        }
        await validateAsync(value.email);
        next();
    } catch (err) {
        return res.status(400).json(err);
    }
}


module.exports = RegisterValidation