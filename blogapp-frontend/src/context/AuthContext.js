import React, { createContext, useContext, useReducer, useState } from 'react';

// Create context
const AuthContext = createContext();

const reducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN' : {
            return {...state, isLoggedIn: true, account: action.payload}
        }
        case 'LOGOUT' : {
            return {...state, isLoggedIn: false, account: null} 
        }
        default: {
            return {...state} 
        }
    }
}

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, dispatchAuth] = useReducer(reducer, {
        isLoggedIn: false, 
        account: null, 
        // posts:null
    })
    

    return (
        <AuthContext.Provider value={{ user, dispatchAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};
