import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const AuthContext = createContext();

const SESSION_KEY = 'trustissues_session';
const TOKEN_KEY = 'trustissues_token';

// Use local backend URL for testing (Replace with Render URL when deployed)
export const API_URL = process.env.NODE_ENV !== 'production' 
    ? 'http://10.110.158.87:5000/api/auth' 
    : 'https://trustissues-1.onrender.com/api/auth';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on app start
        (async () => {
            try {
                const token = await AsyncStorage.getItem(TOKEN_KEY);
                const session = await AsyncStorage.getItem(SESSION_KEY);
                
                if (token && session) {
                    // Optionally: verify token with backend here
                    setUser(JSON.parse(session));
                }
            } catch (e) {
                console.error('Failed to load session:', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Helper to safely parse JSON and catch empty responses
    const safeJsonParse = async (response) => {
        const text = await response.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            console.error("Invalid JSON response:", text);
            return { message: 'Server returned an invalid response. Is the backend running?' };
        }
    };

    const signup = async (name, email, password) => {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await safeJsonParse(response);

        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        const session = { id: data.user.id, name: data.user.name, email: data.user.email, allergies: data.user.allergies || [] };
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session);
    };

    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await safeJsonParse(response);

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        const session = { id: data.user.id, name: data.user.name, email: data.user.email, allergies: data.user.allergies || [] };
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session);
    };

    const updateAllergies = async (allergies) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const response = await fetch(`${API_URL}/me/allergies`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ allergies })
        });
        
        const data = await safeJsonParse(response);
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update allergies');
        }

        const session = { ...user, allergies: data.user.allergies };
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session);
    };

    const logout = async () => {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateAllergies }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
