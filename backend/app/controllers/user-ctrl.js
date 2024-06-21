const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cloudinary = require('../middleware/cloudinary')

const userCtrl = {};

userCtrl.register = async (req, res) => {  
    const body = req.body;
    try {
        const salt = await bcryptjs.genSalt();
        const hashPassword = await bcryptjs.hash(body.passwordHash, salt);
        const user = new User({
            username: body.username,
            email: body.email,
            passwordHash : hashPassword,
            bio: body.bio
            //figure out pfp and bio
        });
        console.log(user, 'user')
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


userCtrl.login = async (req, res) => {
    
    const { email, passwordHash } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const isAuth = await bcryptjs.compare(passwordHash, user.passwordHash);
            if (isAuth) {
                const tokenData = {
                    id: user._id
                };
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' });
                return res.json({ token, user });
            }
            return res.status(401).json({ error: 'Invalid email/password' });
        }
        res.status(404).json({ error: 'Invalid email/password' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

userCtrl.getSingleUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)

        if (!user) {
               return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({user});
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

userCtrl.account = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

userCtrl.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};



userCtrl.updateUser = async (req, res) => {
    try {
        const { id } = req.user;
        const { username, email, bio } = req.body; 



        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user's email
        const updatedUser = await User.findOneAndUpdate(
            { _id: id }, 
            { username, email, bio },   
            { new: true } 
        );

        if (updatedUser) {
            return res.status(200).json( updatedUser );
        }

        console.log(updatedUser);
        return res.status(500).json('Internal server error');
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ error: 'Something went wrong while updating user profile' });
    }
};

userCtrl.uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id
        // let profilePicture = req.file.path

        // profilePicture = profilePicture.replace(/\\/g, '/');

        
        
        cloudinary.uploader.upload(req.file.path, async function (err, result){
            if(err) {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Error"
              })
            }
            const user = await User.findByIdAndUpdate(userId, { profilePicture: result.secure_url }, { new: true })
            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            }
            res.status(200).json({ message: 'Profile picture updated successfully', user })
        })

        
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Something went wrong' })
    }
}


module.exports = userCtrl;

