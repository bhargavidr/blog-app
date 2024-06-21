import React from 'react';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const { user } = useAuth();

    if (!user.isLoggedIn && localStorage.getItem('token')) {
        return <CircularProgress />;
    }

    if (!user.isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return children;
}
