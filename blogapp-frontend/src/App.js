import { Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext';
import { AppBar, Toolbar, Typography, Box, Tooltip } from '@mui/material';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile"; 
import ProfileEdit from './components/ProfileEdit';
import MyPosts from './components/MyPosts';
import Post from './components/Post'
import Comments from './components/Comments';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import Tags from './components/Tags';
import PrivateRoute from './components/PrivateRoute';



// import PrivateRoute from './components/PrivateRoute';

import axios from './config/axios';
import './App.css'

function App() {
  const { user, dispatchAuth } = useAuth();

  useEffect(() => {
    if(localStorage.getItem('token'))  {
      (async () => {
        const response = await axios.get('/api/users/profile', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        dispatchAuth({ type: 'LOGIN', payload: response.data })
      })();
    }
  }, [])

  return (
    <>
  <AppBar position="static" className="app-bar">
           <Toolbar className="toolbar">
               <Box>
                   <Tooltip title="Home">
                       <Link to="/" className="link">Home</Link>
                   </Tooltip>
                  {!user.isLoggedIn ? (
                      <>
                          <Tooltip title="Register">
                              <Link to="/register" className="link">Register</Link>
                          </Tooltip>
                          <Tooltip title="Login">
                              <Link to="/login" className="link">Login</Link>
                          </Tooltip>
                      </>
                   ) : (
                      <>
                          <Tooltip title="Profile" >
                              <Link to="/profile" className="link">Profile</Link>
                          </Tooltip>
                          <Tooltip title="Posts" >
                              <Link to="/posts" className="link">Posts</Link>
                          </Tooltip>
                          <Tooltip title="Logout" >
                              <Link
                                  to="/"
                                  className="link"
                                  onClick={() => {
                                      localStorage.removeItem('token');
                                      dispatchAuth({ type: 'LOGOUT' });
                                  }}
                              >
                                  Logout
                              </Link>
                           </Tooltip>
                      </>
                    )}
                </Box>
                <Typography variant="h6" className="heading">
                    Blog App
                </Typography>
            </Toolbar>
        </AppBar>
      <br />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />         
        <Route path="/profile" element={<PrivateRoute> <Profile /> </PrivateRoute>} /> 
        <Route path="/profileEdit" element={<ProfileEdit />} />    
        <Route path ="/posts" element={<PrivateRoute> <MyPosts /> </PrivateRoute>}/>  
        <Route path ="/post/:id" element={<Post /> }/>  
        <Route path="/api/posts/:postID/comments" element={<Comments />}/>
        <Route path ="/createPost" element={<CreatePost />}/>  
        <Route path ="/editPost" element={<EditPost />}/> 
        <Route path="/tags/:id" element={<Tags />} />    
      </Routes>
      
      <ToastContainer />
      </>
  );
}

export default App;