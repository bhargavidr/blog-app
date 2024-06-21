import React, { useState, useEffect } from 'react';
import {useNavigate, Link} from 'react-router-dom'
import axios from '../config/axios'
import { useAuth } from '../context/AuthContext';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { Fab, Avatar, Box, CardActionArea, Grid, Container,Chip, Skeleton } from '@mui/material';

export default function HomePage(){
    const { user } = useAuth() 
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
  const navigate = useNavigate()
    
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        // console.log(response,'response')
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchTags = async () => {
      try {
        const tagsResponse = await axios.get('/api/tags');
        setTags(tagsResponse.data);
      } catch (error) {
        console.error('There was an error fetching tags', error);
      }
    };

    fetchTags();
    fetchPosts();
  }, [posts]);


  return (
    <div>
      <h2 align='center'>Welcome to Blog App</h2>
      {tags.length > 0 && <>
                <p><b>Check out posts by tags: </b> 
                {tags.length > 0 && tags.map((ele) => (
        <Chip
          clickable
          key={ele._id}
          component={Link}
          to={`/tags/${ele._id}`}
          label={ele.name}
          color="primary"
          variant="outlined"
          style={{ marginRight: '8px', marginBottom: '8px' }}
        />
      ))} </p>     
          </>}
      <Container>
      {posts.length > 0 ? (
        <div>
          <Grid container spacing={3} marginBottom={15}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea onClick={() => navigate(`/post/${post._id}`)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={post.featuredImage}
                      alt={post.title}
                    />
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography gutterBottom variant="h5" component="div">
                          {post.title}
                        </Typography>
                        <Avatar
                          alt={post.author.username}
                          src={post.author.profilePicture}
                          sx={{ width: 35, height: 35 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tags: {post.tags.map(ele => ele.name).join(', ')}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          {user.isLoggedIn && <Fab fontSize="large" aria-label="add" sx={{ background:"#f76c5e", position: 'fixed', bottom: 70, right: 65 }}>
            <AddIcon fontSize="large" onClick={()=> navigate("/createPost")}/>
          </Fab>}
        </div>
      ) : (
        <>
        <Skeleton variant="circular" width={40} height={40} animation="wave"/>
        <Skeleton variant="rectangular" width={210} height={60} animation="wave"/>
        <Skeleton variant="rounded" width={210} height={60} animation="wave"/>
        </>
      )}
    </Container>
    </div>
  );
};
