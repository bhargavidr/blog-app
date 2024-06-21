//using formik

import { useState } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, FormGroup, Grid } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './Components.css'


export default function Register() {
    const navigate = useNavigate();
    const [serverErrors, setServerErrors] = useState(null);

    const showToastMessage = () => {
        toast.success("Successfully Registered!", {
          position: "top-right",
        });
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        passwordHash: Yup.string().min(8, 'Password must be at least 8 characters')
            .max(128, 'Password must be at most 128 characters')
            .required('Password is required')
    });

    const initialValues = {
        username: '',
        email: '',
        passwordHash: ''
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('/api/users/register', values);
            showToastMessage();
            navigate('/login');
        } catch (err) {
            setServerErrors(err.response.data.details);
            toast.error('Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    const displayErrors = () => {
        let result;
        // console.log(form.serverErrors)
        if (typeof serverErrors == 'string') {
            result = <p> {serverErrors} </p>;
        } else {
            result = (
                    <ul>
                        {serverErrors.map((error, index) => {
                            return <li className='error' key={index}>{error.message}</li>
                        })}
                    </ul>            
            );
        }
        return result;
    };

    

    return (
        <div align="center">
            <h2>Register Here</h2>

            

<Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
    > 
        {({ handleChange, values, touched, errors, isSubmitting }) => (
            <Form>
                <Grid container spacing={3} alignItems="center" justifyContent="center">                
                <FormGroup>
                {serverErrors && displayErrors()}
                    <TextField
                        label="Enter Username"
                        type="text"
                        value={values.username}
                        onChange={handleChange}
                        name="username"
                        id="username"
                        margin="normal"
                        fullWidth
                        error={touched.username && !!errors.username}
                        helperText={touched.username && errors.username}
                    />
                    <TextField
                        label="Enter Email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        name="email"
                        id="email"
                        margin="normal"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        label="Enter Password"
                        type="password"
                        value={values.passwordHash}
                        onChange={handleChange}
                        name="passwordHash"
                        id="passwordHash"
                        margin="normal"
                        fullWidth
                        error={touched.passwordHash && !!errors.passwordHash}
                        helperText={touched.passwordHash && errors.passwordHash}
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isSubmitting}>
                        Submit
                    </Button>
                </FormGroup>
            </Grid>
            </Form>
        )}
    </Formik>
    <ToastContainer />
        </div>
    );
}







// import React, { useState } from 'react';
// import axios from '../config/axios';
// import validator from 'validator';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// import { useNavigate } from 'react-router-dom';

// export default function Register() {
//     const navigate = useNavigate();
//     const [username, setUsername] = useState('');
//     const [passwordHash, setPasswordHash] = useState('');
//     const [email, setEmail] = useState('');
//     const [serverErrors, setServerErrors] = useState(null);
//     const [clientErrors, setClientErrors] = useState({});
    
//     const validationSchema = Yup.object().shape({
//         username: Yup.string().required('Username is required'),
//         email: Yup.string().email('Invalid email format').required('Email is required'),
//         passwordHash: Yup.string().min(8, 'Password must be at least 8 characters')
//             .max(128, 'Password must be at most 128 characters')
//             .required('Password is required')
//     });

//     const initialValues = {
//         username: '',
//         email: '',
//         passwordHash: ''
//     };



//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = {
//             username,
//             email,
//             passwordHash
//         };

//             try {
//                 const response = await axios.post(`/api/users/register`, formData);
//                 navigate('/login');
//             } catch (err) {
//                 setServerErrors(err.response.data.details);
//                 // console.log(err)
//             }
        
//     };

//     return (
//         <div>
//             <h3>Register Here</h3>

//             {serverErrors && (
//                 <div>
//                     <h3>These are the server errors</h3>
//                     <ul>
//                         {serverErrors.map((error, index) => (
//                             <li key={index}>{error.msg}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             <Formik
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={handleSubmit}
//             >

//             {({ setFieldValue, setFieldError, isSubmitting }) => (
//                     <Form>
//                         <label htmlFor="username">Enter Username</label><br/>
//                         <Field type="text" id="username" name="username" />
//                         <ErrorMessage name="username" component="div" /><br/>

//                         <label htmlFor="email">Enter Email</label><br/>
//                         <Field 
//                             type="email" 
//                             id="email" 
//                             name="email"
//                         />
//                         <ErrorMessage name="email" component="div" /><br/>

//                         <label htmlFor="password">Enter Password</label><br/>
//                         <Field type="password" id="passwordHash" name="passwordHash" />
//                         <ErrorMessage name="passwordHash" component="div" /><br/>

//                         <button type="submit" disabled={isSubmitting}>Submit</button>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     );
// }


