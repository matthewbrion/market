import { createContext, useContext, useState } from "react";
import request from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);

    async function register(name, password) {
        const newToken = await request('/users/register', {
            method: 'POST',
            body: { username: name, password },
        });
        setToken(newToken);
        setUsername(name);
    }

    async function login(name, password) {
        const newToken = await request('/users/login', {
            method: 'POST',
            body: { username: name, password },
        });
        setToken(newToken);
        setUsername(name);
    }

    function logout() {
        setToken(null);
        setUsername(null);
    }
    
    const value = { token, username, register, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}