import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { formatDistanceToNowStrict} from 'date-fns'

import { Box, Button, TextField, Typography, Grid, Avatar, Divider, Alert } from '@mui/material';



export default function Comments({id, post}){

    const { user } = useAuth();
    const [comments,setComments] = useState([])
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    const errors ={}
    const [clientErrors, setClientErrors] = useState({})

    useEffect(() => {
        const fetchComments = async () => {
          try {
            const response = await axios.get(`/api/posts/${id}/comments`, {
              headers: {
                Authorization: localStorage.getItem('token'),
              },
            });
            // console.log(response, 'response')
            setComments(response.data);
          } catch (error) {
            console.error('Error fetching comments', error);
          }
        };
    
        fetchComments();
      }, [newComment]);


    const handleAddComment = async () => {
        if(newComment.trim().length == 0  ){
            errors.add = 'Cannot add empty comment'
            setClientErrors(errors)
        }else{
            try {
                const response = await axios.post(`/api/posts/${id}/comments`, {
                    content: newComment
                }, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
    
                if (response.data) {
                    setComments([...comments, response.data]);
                    setNewComment('');
                    setClientErrors({})
                } else {
                    console.log('error adding comment');
                }
            } catch (error) {
                console.error("Error adding comment:", error);
            }

        }
        
    };

    const handleEditComment = async (commentId) => {
        if(editedComment.trim().length == 0 ){
            errors.edit = 'Cannot add empty comment'
            setClientErrors(errors)
        }else{
            try {
                const response = await axios.put(`/api/posts/${id}/comments/${commentId}`, {
                    content: editedComment
                }, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
    
                if (response.data) {
                    const updatedComments = comments.map(comment => {
                        if (comment._id === commentId) {
                            return { ...comment, content: editedComment };
                        }
                        return comment;
                    });
                    setComments(updatedComments);
                    setEditingCommentId(null);
                    setEditedComment('');
                    setClientErrors({})
      
                } else {
                    console.log('error editing comment');
                }

            } catch (error) {
                console.error("Error editing comment:", error);
            }

        }
        
    };

    const handleDeleteComment = async (commentId) => {
        try {
            if(window.confirm("Are you sure?")){
                const response = await axios.delete(`/api/posts/${id}/comments/${commentId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
    
                if (response.data) {
                    const filteredComments = comments.filter(comment => comment._id !== commentId);
                    setComments(filteredComments);
                } else {
                    console.log('error deleting comment');
                }                
              }else{
                alert("Deletion cancelled")
              }
            
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };
    

    return (
        <Box sx={{ padding: '14px' }}>
          <Typography variant="h4" gutterBottom>
            <u>Comments</u>
          </Typography>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Box key={comment._id} sx={{ padding: '2px 0' }}>
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item>
                    <Avatar alt={comment.author.username} src={comment.author.profilePicture} />
                  </Grid>
                  <Grid justifyContent="left" item>
                    <Typography variant="h6" sx={{ margin: 0, textAlign: 'left' }}>
                      {comment.author.username}
                    </Typography>
                    {editingCommentId === comment._id ? (
                      <>
                        <TextField 
                          fullWidth 
                          variant="outlined" 
                          value={editedComment} 
                          onChange={(e) => setEditedComment(e.target.value)} 
                          sx={{ marginY: 2 }}
                        />
                        {clientErrors.edit && (
                          <Typography variant="body2" color="error">
                            {clientErrors.edit}
                          </Typography>
                        )}
                        <Button variant="contained" onClick={() => handleEditComment(comment._id)} sx={{ mt: 1 }}>
                          Save
                        </Button>                        
                      </>
                    ) : (
                      <>
                        <Typography sx={{ textAlign: 'left' }}>{comment.content}</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
                          {formatDistanceToNowStrict(new Date(comment.updatedAt))} ago
                        </Typography>
                      </>
                    )}
                    {(post.author._id === user.account?._id || comment.author._id === user.account?._id) && (
                      <Box >
                        {comment.author._id === user.account?._id && (
                          <Button size="small" onClick={() => { setEditingCommentId(comment._id); setEditedComment(comment.content); }}>
                            Edit
                          </Button>
                        )}
                        <Button size="small" onClick={() => handleDeleteComment(comment._id)}>
                          Delete
                        </Button>
                      </Box>
                    )}
                  </Grid>
                </Grid>
                <Divider variant="fullWidth" sx={{ marginY: '20px' }} />
              </Box>
            ))
          ) : (
            <Typography variant="body1">No comments found</Typography>
          )}
          {user.account ? (
            <Box mt={2}>
              <Typography variant="h6">Add Comment</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mt: 2 }}
              />
              {clientErrors.add && (
                <Typography variant="body2" color="error">
                  {clientErrors.add}
                </Typography>
              )}
              <Button variant="contained" onClick={handleAddComment} sx={{ my: 2 }}>
                Add Comment
              </Button>              
            </Box>
          ) : (
            <Typography variant="body1">Login to add comments!</Typography>
          )}
        </Box>
      );
};
