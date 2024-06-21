// Post.js
import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import {Link} from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EditPost from './EditPost';
import Comments from './Comments';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import format from 'date-fns/format'


import { Box, Button, Paper, Typography, Avatar, CircularProgress} from '@mui/material';

const Post = () => {
  const {user} = useAuth()
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [profileDeleted, setProfileDeleted] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const navigate= useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [isEdit]);

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleDelete = async () => { 
    try {
      if(window.confirm("Are you sure?")){
        await axios.delete(`/api/posts/${id}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        });
        setProfileDeleted(true);
      }else{
        alert("Deletion cancelled")
      }
    } catch (error) {
        console.error('Error deleting post:', error);            
    }
  };


  if (!post) {
    return <CircularProgress sx={{margin: '50px 700px'}} />;
  }

  return (
    <div>
      {profileDeleted && navigate('/posts')}
      {!isEdit ? (
        <>
        <Paper elevation='1' variant="outlined" sx={{ margin: '0 200px',padding:'2px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin:2 }}>
        <Button onClick={() => navigate('/')}>Back</Button>
        {post.author._id === user.account?._id && (
          <Box>
            <Button onClick={handleEdit} sx={{ mr: 1 }}>Edit</Button>
            <Button onClick={handleDelete}>Delete</Button>
          </Box>
        )}
      </Box>

        <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" component="h2">
          {post.title}
        </Typography>
        <Typography variant="h5" component="h5">
          <Box display="flex" alignItems="center"  justifyContent="center">
            By {post.author.username}
            <Avatar
              alt={post.authorName}
              src={post.author.profilePicture}
              sx={{ width: 25, height: 25, marginLeft: 1 }}
            />
          </Box>
        </Typography>
          
          <Typography variant="body2">
          Posted on {format(post.createdAt, "do MMM yyyy h:mma")}
        </Typography> <br/>        
          <img
            src={post.featuredImage}
            alt={post.title}
            style={{ maxWidth: '600px', maxHeight: '200px' }}
          />
        </Box>
        <Typography 
            variant="body1" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            sx={{ margin: '0 10px' }} 
        />
        
        {post.tags.length > 0 && (
          <p style={{ margin: '10px 10px' }}>
            <b>Tags: </b>
            {post.tags.map(tag => (
              <Link to={`/tags/${tag._id}`} key={tag._id}>
                {tag.name} |
              </Link>
            ))} 
             <br />
          </p>
         
        )}
        </Paper>
        
        <Comments id={id} post={post} />
        <br />
        <ToastContainer />
      </>
      ) : (
        <EditPost post={post} isEdit={isEdit} setIsEdit={setIsEdit} />
      )}
      <ToastContainer />
    </div>
  );
};

export default Post;
