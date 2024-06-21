import { useState } from "react";
import axios from '../config/axios';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from 'validator';
import _ from 'lodash';

// Material-UI components and icons
import { Avatar, Button, TextField, Typography, Paper, Box, Grid, Stack, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export default function ProfileEdit({ setIsEdit }) {
  const { user, dispatchAuth } = useAuth();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // To store the preview of the selected image
  const [formData, setFormData] = useState({
    username: user.account.username,
    email: user.account.email,
    bio: user.account.bio,
    servererrors:null,
    clientErrors:{}
  });

  const errors = {}
  const runValidations = () => {
    if (formData.email.trim().length === 0) {
        errors.email = 'Email is required';
    } else if (!validator.isEmail(formData.email)) {
        errors.email = 'Invalid email format';
    }

    if (formData.username.trim().length === 0) {
        errors.username = 'username is required';
    } 
};

  const showToastMessage = () => {
    toast("Profile edited!");
  };

  let navigate = useNavigate();

  const submitImage = async (e) => {
    e.preventDefault();
    if (!image) return;

    try {
      const imageData = new FormData();
      imageData.append("profilePicture", image);

      const result = await axios.post("/api/users/upload-profile-picture", imageData, {
        headers: { Authorization: localStorage.getItem('token'), "Content-Type": "multipart/form-data" },
      });
      console.log(result, 'result');
      dispatchAuth({ type: 'LOGIN', payload: result.data.user });
      setImage(null);
      setImagePreview(null); // Clear the image preview after upload
    } catch (err) {
      console.error(err);
    }
  };

  const onImageChange = (e) => {
    console.log(e.target.files[0]);
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    // Set image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    runValidations()
    if(Object.keys(errors).length == 0 ){
    try {
      const form = _.pick(formData,['username','email','bio'])
      const updatedUser = await axios.put(`/api/users/profile`, form, {
      headers: { Authorization: localStorage.getItem('token') }
      });
      if (!updatedUser) {
        return console.error('Updated user not found');
      }
      // console.log(updatedUser,'updatedUser')
      dispatchAuth({ type: "LOGIN", payload: updatedUser.data });
      showToastMessage();
      setIsEdit(false);
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setFormData({ ...formData, serverErrors: err.response.data.details, clientErrors: {} });
    }
    }else{
      setFormData({ ...formData, clientErrors: errors });
    }
  };

  const displayErrors = () => {
    let result;
    // console.log(form.serverErrors)
    if (typeof formData.serverErrors == 'string') {
        result = <p> {formData.serverErrors} </p>;
    } else {
        result = (                
                <ul>
                    {formData.serverErrors.map(ele => {
                        return <li className='error' key={ele.type}>{ele.message}</li>
                    })}
                </ul>            
        );
    }
    return result;
};

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: 'auto', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>Edit Profile</Typography>
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        
          <Stack direction="column" alignItems="center" spacing={2} mb={2}>
            <Avatar
              alt={formData.username}
              src={user.account.profilePicture}
              sx={{ width: 200, height: 200 }}
            />
            <Box>
              <form onSubmit={submitImage} style={{ display: 'inline-block' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  style={{ display: 'none' }}
                  id="upload-profile-pic"
                />
                <label htmlFor="upload-profile-pic">
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={image ? <PhotoCameraIcon /> : <PhotoCameraBackIcon />}
                  >
                    {image ? "Change Image" : "Upload Image"}
                  </Button>
                </label>
                {image && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={<CheckIcon />}
                    sx={{ ml: 1 }}
                  >
                    Submit Image
                  </Button>
                )}
              </form>
            </Box>
          </Stack>
        
      </Box>
      {imagePreview && (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mb={2}>
          <Typography variant="body1" gutterBottom>{image.name}</Typography>
          <img src={imagePreview} alt="Selected" style={{ width: '200px', height: 'auto' }} />
        </Box>
      )}
      <Divider />
      <Box mt={3}>
      {formData.serverErrors && displayErrors()}
        <form onSubmit={submitForm}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={onInputChange}
                error={formData.clientErrors.username}
                helperText={formData.clientErrors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
                error={formData.clientErrors.email}
                helperText={formData.clientErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                multiline
                rows={4}
                value={formData.bio}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<CheckIcon />}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <ToastContainer />
    </Paper>
  );
}
