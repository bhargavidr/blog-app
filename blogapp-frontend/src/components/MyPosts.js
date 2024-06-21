import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from '../config/axios'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import AddIcon from '@mui/icons-material/Add';
import format from 'date-fns/format'
import { Fab, Typography, Button, CardActionArea, CardActions, Grid, Container, CircularProgress } from '@mui/material';

export default function Posts(){

  const [posts, setPosts] = useState([]);
  let navigate = useNavigate()
    
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts/myposts', {
          headers: {
            Authorization: localStorage.getItem('token'),
          }
        });
        // console.log(response,'response')
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [posts]);

  const handleDelete = async (id) => { 
    try {
      if(window.confirm("Are you sure?")){
        await axios.delete(`/api/posts/${id}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        });
      }else{
        alert("Deletion cancelled")
      }
    } catch (error) {
        console.error('Error deleting post:', error);            
    }
  };



  return (
      <Container>
      {posts.length > 0 ? (
        <div>
          <h2>Your posts</h2>
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
                      <Typography gutterBottom variant="h5" component="div">
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated {format(post.createdAt, "do MMM yyyy h:mma")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tags: {post.tags.map(ele => ele.name).join(', ')}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() =>handleDelete(post._id)} >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid> <br />
          
        </div>
      ) : (
        <Typography>No blogs yet</Typography> 
      )}
      <br />
      <Fab fontSize="large" aria-label="add" sx={{ background:"#f76c5e", position: 'absolute', bottom: 70, right: 65 }}>
            <AddIcon fontSize="large" onClick={()=> navigate("/createPost")}/>
      </Fab>
    </Container>

  );
};

