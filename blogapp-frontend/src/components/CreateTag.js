import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText
} from '@mui/material';
import axios from '../config/axios'; 

const CreateTag = ({open,onClose, tagOptions, setTagOptions, post}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    posts: []
  });
  const [postOptions, setPostOptions] = useState([]);
  const [clientErrors, setClientErrors] = useState('')

  useEffect(() => {
    // Fetch posts to populate the multi-select options
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts/myposts',{
            headers: {
              Authorization: localStorage.getItem('token'),
            }
          }); 
        
        // console.log(post, 'post')
        if(post){ //while editing post, dont show current post in options
          const otherPosts = response.data.filter(ele => ele._id != post._id)
          setPostOptions(otherPosts)
        }else{
          setPostOptions(response.data);
        }
        
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleClose = () => {
    onClose();
    setFormData({
        name: '',
        description: '',
        posts: []
      })
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelectChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, posts: value });
  };

  const handleSubmit = async (e) => {
    if(formData.name.trim().length == 0  ){
        setClientErrors('Title is required')
        return
    }
    e.preventDefault();
    const selectedPostIds = formData.posts.map((post) => post._id);
    setFormData({ ...formData, posts: selectedPostIds });

    try {
      const response = await axios.post('/api/tags', formData,{
        headers: {
          Authorization: localStorage.getItem('token'),
        }
      }); 
    //   console.log(response)
      window.alert(`Tag created: ${response.data.name}`);
      setTagOptions([...tagOptions, response.data])
      handleClose();
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new tag, please fill in the following information.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Tag Name"
            fullWidth
            variant="standard"
            value={formData.name}
            onChange={handleChange}
            error={clientErrors}
            helperText={clientErrors && 'Tag Name is required'}
          />
          <TextField
            required
            margin="dense"
            id="description"
            name="description"
            label="Description"
            fullWidth
            variant="standard"
            value={formData.description}
            onChange={handleChange}
          />
          {postOptions.length > 0 && <FormControl fullWidth margin="dense">
            <InputLabel id="posts-label">Add your posts</InputLabel>
            <Select
              labelId="posts-label"
              id="posts"
              name="posts"
              multiple
              value={formData.posts}
              onChange={handleMultiSelectChange}
              renderValue={(selected) => selected.map((post) => post.title).join(', ')}
            >
              {postOptions.map((post) => (
                <MenuItem key={post._id} value={post}>
                  <Checkbox checked={formData.posts.indexOf(post) > -1} />
                  <ListItemText primary={post.title} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} type="submit">Create Tag</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateTag;
