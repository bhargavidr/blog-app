import { useState } from 'react';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import _ from 'lodash';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, FormGroup, Button, TextField, Grid, Paper } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Login() {
    const { dispatchAuth, PORT } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        passwordHash: '',
        serverErrors: null,
        clientErrors: {}
    });

    const showToastMessage = () => {
        toast("Successfully Logged In!");
    };

    const errors = {};

    const runValidations = () => {
        if (form.email.trim().length === 0) {
            errors.email = 'Email is required';
        } else if (!validator.isEmail(form.email)) {
            errors.email = 'Invalid email format';
        }

        if (form.passwordHash.trim().length === 0) {
            errors.passwordHash = 'Password is required';
        } else if (form.passwordHash.trim().length < 8 || form.passwordHash.trim().length > 128) {
            errors.passwordHash = 'Invalid password length';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = _.pick(form, ['email', 'passwordHash']);

        runValidations();

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post(`/api/users/login`, formData); //
                localStorage.setItem('token', response.data.token);
                const userResponse = await axios.get(`/api/users/profile`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                dispatchAuth({type:'LOGIN', payload:userResponse.data});
                showToastMessage();
                // console.log(userResponse.data, 'userResponse')
                navigate('/');
            } catch (err) {
                console.log(err)
                setForm({ ...form, serverErrors: err.response.data.error, clientErrors: {} });
            }
        } else {
            setForm({ ...form, clientErrors: errors });
        }
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setForm({ ...form, [name]: value });
    };

    const displayErrors = () => {
        let result;
        // console.log(form.serverErrors)
        if (typeof form.serverErrors == 'string') {
            result = <p className='error'> {form.serverErrors} </p>;
        } else {
            result = (
                <div>
                    <h3>These errors prohibited the form from being saved: </h3>
                    <ul>
                        {form.serverErrors.map(ele => {
                            return <li key={ele.type}>{ele.message}</li>
                        })}
                    </ul>
                </div>
            );
        }
        return result;
    };

    return (  
        <>      
        <Container>
            <br/>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h4" gutterBottom>
                            Login
                        </Typography>
                        {form.serverErrors && displayErrors()}
                        <form onSubmit={handleSubmit}>
                            <FormGroup>
                                <TextField
                                    label="Enter email"
                                    type="text"
                                    value={form.email}
                                    onChange={handleChange}
                                    name="email"
                                    id="email"
                                    margin="normal"
                                    fullWidth
                                    error={!!form.clientErrors.email}
                                    helperText={form.clientErrors.email}
                                />
                                <TextField
                                    label="Enter password"
                                    type="password"
                                    value={form.passwordHash}
                                    onChange={handleChange}
                                    name="passwordHash"
                                    id="password"
                                    margin="normal"
                                    fullWidth
                                    error={!!form.clientErrors.passwordHash}
                                    helperText={form.clientErrors.passwordHash}
                                />
                                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                                    Submit
                                </Button>
                            </FormGroup>
                        </form>
                    </Paper>
                </Grid>        
            </Grid>        
        </Container>
        <ToastContainer />
        </>
    );
}
