import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from '../config/axios';
import CreateTag from "./CreateTag";
import { useAuth } from '../context/AuthContext';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Grid, Container, Box, Avatar, Chip, Skeleton } from '@mui/material';

export default function Tags(){
    const {id} = useParams()
    const {user} = useAuth()
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [tag,setTag] = useState({})
  const[open,setOpen] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        // console.log(id,'id')
      try {
        const postsResponse = await axios.get(`/api/posts/tags/${id}`);
        setPosts(postsResponse.data);

        //get tags
        const tagsResponse = await axios.get('/api/tags');
        setTags(tagsResponse.data);

        const tag = tagsResponse.data.find((ele) =>  ele._id == id)
        setTag(tag)
        // console.log(tag,'tag')
      // console.log(tagsResponse,'response for tags api')
      } catch (error) {
        console.error('There was an error fetching posts', error);
      }
    };

    fetchData();
  }, [id]);

  const isFilled = (tagId) => {
    if(tagId == id){
      return "filled"
    }
    return "outlined"
  }


  return (
    <div>
      <div style={{marginLeft:'10px'}}>
      <h2>Tags</h2>
      <b>Check out posts by tags: </b> 
      {tags.length > 0 && tags.map((ele) => (
        <Chip
          clickable
          key={ele._id}
          component={Link}
          to={`/tags/${ele._id}`}
          label={ele.name}
          color="primary"
          variant={isFilled(ele._id)}
          style={{ marginRight: '8px', marginBottom: '8px' }}
        />
      ))}
      {user.isLoggedIn && <Chip clickable key="add-tag" label="Add new tag" onClick={()=>setOpen(true)}
          color="primary"
          variant="filled"
          style={{ marginRight: '8px', marginBottom: '8px' }}/>}
      <CreateTag open={open} onClose={() => setOpen(false) }/>    
      </div>
      <Container>
      
      
        
          <Box textAlign="center" mb={3}>
          <Typography variant="h5" >{tag.name}</Typography>
          <Typography variant="subtitle1" >{tag.description}</Typography>
          </Box>
          {posts.length > 0 ? (
          <Grid container spacing={3}>
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
                          alt={post.authorName}
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
        
      ) : (
        <>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={210} height={60} />
        <Skeleton variant="rounded" width={210} height={60} />
        <Typography variant="body2" color="text.secondary">It looks like there's no blog under this tag!</Typography>
        </>
      )}
    </Container>
      <br />
    </div>
  );
};


