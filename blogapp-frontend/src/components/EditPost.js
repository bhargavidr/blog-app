import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { useNavigate } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import validator from 'validator';
import _ from 'lodash';
import axios from '../config/axios';
import CreateTag from './CreateTag';
import MultiSelect from 'multiselect-react-dropdown';
import { Button, Container, FormControl, Grid, TextField, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditPost = ({ post, setIsEdit }) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(post.content).contentBlocks))
  );
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState({ ...post, clientErrors: {}, serverErrors: null });
  const [tagOptions, setTagOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/tags');
        const tags = response.data.map(tag => ({ name: tag.name, _id: tag._id }));
        setTagOptions(tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const showToastMessage = () => {
    toast('Post updated!');
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
    const rawContentState = convertToRaw(state.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    setEditingPost({ ...editingPost, content: htmlContent });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPost({ ...editingPost, [name]: value });
  };

  const handleTagsChange = (selectedList) => {
    setEditingPost({ ...editingPost, tags: selectedList });
  };

  const runValidations = () => {
    const errors = {};

    if (!editingPost.title || editingPost.title.trim().length === 0) {
      errors.title = 'Title is required';
    }

    if (editingPost.content && editingPost.content.trim().length < 10) {
      errors.content = 'Content must be at least 10 characters long';
    }

    if (editingPost.featuredImage && !validator.isURL(editingPost.featuredImage)) {
      errors.featuredImage = 'Featured image must be an image URL';
    }

    return errors;
  };

  const displayErrors = () => {
    let result;
    if (typeof editingPost.serverErrors === 'string') {
      result = <p>{editingPost.serverErrors}</p>;
    } else {
      result = (
        <ul>
          {editingPost.serverErrors.map(ele => (
            <li className='error' key={ele.type}>{ele.message}</li>
          ))}
        </ul>
      );
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = runValidations();
    if (Object.keys(errors).length === 0) {
      try {
        let formData = { ...editingPost, content: draftToHtml(convertToRaw(editorState.getCurrentContent())) };
        formData = _.pick(formData, ['title', 'featuredImage', 'content', 'tags']);

        await axios.put(`/api/posts/${post._id}`, formData, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        showToastMessage();
        setIsEdit(false);
        setEditingPost({});
        navigate(`/post/${post._id}`);
      } catch (error) {
        console.error('Error:', error);
        setEditingPost({ ...editingPost, serverErrors: error.response.data.details, clientErrors: {} });
      }
    } else {
      setEditingPost({ ...editingPost, clientErrors: errors });
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Edit Post
      </Typography>
      {editingPost.serverErrors && displayErrors()}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={editingPost.title}
              onChange={handleInputChange}
              error={editingPost.clientErrors.title}
              helperText={editingPost.clientErrors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Featured Image link"
              name="featuredImage"
              value={editingPost.featuredImage}
              onChange={handleInputChange}
              error={editingPost.clientErrors.featuredImage}
              helperText={editingPost.clientErrors.featuredImage}
            />
          </Grid>
          <Grid item xs={12}>
            {editingPost.clientErrors.content && <span className="error">{editingPost.clientErrors.content}</span>}
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={handleEditorChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <label>Tags</label>
              <MultiSelect
                showCheckbox
                options={tagOptions}
                displayValue="name"
                selectedValues={editingPost.tags}
                onSelect={handleTagsChange}
                onRemove={handleTagsChange}
              />
              <Button justifyContent="flex-start">
                <Typography variant="overline" onClick={() => setOpen(true)}>
                  Cannot find relevant tag? Add your own
                </Typography>
              </Button>
              <CreateTag open={open} onClose={() => setOpen(false)} 
                         tagOptions= {tagOptions} setTagOptions={setTagOptions}
                         post = {post} />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Container>
  );
};

export default EditPost;
