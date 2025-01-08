import React, { createContext, useState, useContext, useEffect } from 'react';

// Create and export the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem("user_name");
        if (storedUserData) {
            setUser(JSON.parse(storedUserData));
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("user_name");
        setUser(null);
    };
    
    const login = (userName, userId) => {
        const userData = { name: userName, id: userId };
        localStorage.setItem("user_name", JSON.stringify(userData)); // Store user data as JSON
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
