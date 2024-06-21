require('dotenv').config();
const express = require('express');
const app = express()
const fs = require('fs')
const morgan = require('morgan')

const cors = require('cors');
const configureDB = require('./config/db');
configureDB();

const path = require('path')
const upload = require('./app/middleware/multer')
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// const logFilePath = path.join(__dirname, 'logs.txt')
// const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' })
// app.use(morgan('combined', { stream: accessLogStream }))


app.use(cors());
app.use(express.json());


//import validations
const RegisterValidation = require('./app/validations/RegisterValidation')
const LoginValidation = require('./app/validations/LoginValidation')
const UserUpdateValidation = require('./app/validations/UserUpdateValidation')
const PostValidation = require('./app/validations/PostValidation')
const PostEditValidation = require('./app/validations/PostEditValidation')
const idValidation = require('./app/validations/idValidation')
const CommentValidation = require('./app/validations/CommentValidation')

//import middlewares
const AuthenticateUser = require('./app/middleware/AuthenticateUser')
const AuthLayer = require('./app/middleware/AuthLayer')


// import controllers
const userCtrl = require('./app/controllers/user-ctrl');
const postCtrl = require('./app/controllers/post-ctrl');
const commentCtrl = require('./app/controllers/comment-ctrl');
const tagCtrl = require('./app/controllers/tag-ctrl')


//routes
app.post('/api/users/register', RegisterValidation, userCtrl.register);
app.post('/api/users/login', LoginValidation, userCtrl.login);
app.get('/api/users/profile',AuthenticateUser, userCtrl.account);
app.get('/api/users/:id', idValidation(['id']), userCtrl.getSingleUser)
app.put('/api/users/profile', AuthenticateUser, UserUpdateValidation, userCtrl.updateUser);
app.get('',userCtrl.getAllUsers)
app.post('/api/users/upload-profile-picture', AuthenticateUser, upload.single('profilePicture'), userCtrl.uploadProfilePicture)



app.post('/api/posts', AuthenticateUser, PostValidation, postCtrl.createPost);
app.get('/api/posts', postCtrl.getAllPosts);
app.get('/api/posts/myposts', AuthenticateUser, postCtrl.getMyPosts);
app.get('/api/posts/:id', idValidation(['id']), postCtrl.getOnePost);
app.put('/api/posts/:id', AuthenticateUser, AuthLayer.post, idValidation(['id']), PostEditValidation, postCtrl.updatePost);
app.delete('/api/posts/:id', AuthenticateUser, AuthLayer.post, idValidation(['id']), postCtrl.deletePost);
app.get('/api/posts/tags/:id',idValidation(['id']), postCtrl.getPostsByTags);
app.get('/api/posts/user/id', idValidation(['id']), postCtrl.getPostsByUserId);

//tags
app.post('/api/tags',AuthenticateUser,tagCtrl.createTag)
app.get('/api/tags',tagCtrl.getTags)

//routes of comments
app.post('/api/posts/:postId/comments',AuthenticateUser,idValidation(['postId']),CommentValidation, commentCtrl.createComment);
app.get('/api/posts/:postId/comments',idValidation(['postId']), commentCtrl.getCommentsByPost);
app.put('/api/posts/:postId/comments/:commentId',AuthenticateUser,idValidation(['postId','commentId']), AuthLayer.commentEdit, CommentValidation, commentCtrl.updateComment);
app.delete('/api/posts/:postId/comments/:commentId',AuthenticateUser,idValidation(['postId','commentId']), AuthLayer.commentDelete,  commentCtrl.deleteComment);





const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});