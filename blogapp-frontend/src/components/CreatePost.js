import React, { useState, useEffect } from 'react';
import validator from 'validator';
import _ from 'lodash';
import{useNavigate} from 'react-router-dom'

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import axios from '../config/axios';
import CreateTag from "./CreateTag";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  TextField,  Button,  Typography,  Container,  Grid,  FormControl,  InputLabel,  MenuItem,  Select
} from '@mui/material';

const CreatePost = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [post, setPost] = useState({
    title: '',
    content: '',
    featuredImage: '',
    tags: [],
    clientErrors:{},
    serverErrors:null
  });
  const [tagOptions, setTagOptions] = useState([]);
  const[open,setOpen] = useState(false)

  const navigate = useNavigate()

  const errors = {};

const runValidations = () => {
  
  if (!post.title || post.title.trim().length === 0) {
    errors.title = 'Title is required';
  }
  
  if (post.content && post.content.trim().length < 10) {
    errors.content = 'Description must be at least 10 characters long';
  }

  if(post.featuredImage.trim().length > 0){
  if (!validator.isURL(post.featuredImage)) {
    errors.featuredImage = 'Featured image must be an image URL';
  }
  }
};


  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/tags');
        const tags = response.data.map((tag) => ({ name: tag.name, _id: tag._id }));
        setTagOptions(tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const showToastMessage = () => {
    toast('Successfully created new post!');
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
    const rawContentState = convertToRaw(state.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    setPost({ ...post, content: htmlContent });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleTagsChange = (e) => {
    const selectedTags = e.target.value;
    console.log(selectedTags)
    setPost({ ...post, tags: selectedTags });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    runValidations();
    if(Object.keys(errors).length == 0 ){
      try {
        const postData = _.pick(post,['title','content','featuredImage','tags'])
        const response = await axios.post('/api/posts', postData, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        showToastMessage();
        navigate('/posts');
      } catch (error) {
        console.error('Error:', error);
        setPost({ ...post, serverErrors: error.response.data.details, clientErrors: {} });
      }
    }else{
      setPost({ ...post, clientErrors: errors });
    }   
  };

  const displayErrors = () => {
    let result;
    // console.log(post.serverErrors)
    if (typeof post.serverErrors == 'string') {
        result = <p> {post.serverErrors} </p>;
    } else {
        result = (                
                <ul>
                    {post.serverErrors.map(ele => {
                        return <li className='error' key={ele.type}>{ele.message}</li>
                    })}
                </ul>            
        );
    }
    return result;
};


  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Create Post
      </Typography>
      {post.serverErrors && displayErrors()}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={post.title}
              onChange={handleInputChange}
              error={post.clientErrors.title}
              helperText={post.clientErrors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Featured Image link"
              name="featuredImage"
              value={post.featuredImage}
              onChange={handleInputChange}
              error={post.clientErrors.featuredImage}
              helperText={post.clientErrors.featuredImage}
            />
          </Grid>
          <Grid item >
            {post.clientErrors.content && <span className="error">{post.clientErrors.content}</span>}
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={handleEditorChange}
            />
          </Grid>
          <Grid item xs={12} >
            <FormControl fullWidth>
              <InputLabel id="tags-label">Tags</InputLabel>
              <Select
                labelId="tags-label"
                id="tags"
                multiple
                value={post.tags}
                onChange={handleTagsChange}
                inputProps={{ 'aria-label': 'Select Tags' }}
              >
                {tagOptions.map((tag) => (
                  <MenuItem key={tag._id} value={tag}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
              <Button justifyContent="flex-start">
                <Typography variant="overline" 
                          onClick={() => setOpen(true)}>
                            Cannot find relevant tag? Add your own
                </Typography>
              </Button>
              <CreateTag open={open} onClose={() => {setOpen(false)} } 
                          tagOptions= {tagOptions} setTagOptions={setTagOptions} /> 
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Container>
  );
};

export default CreatePost;
