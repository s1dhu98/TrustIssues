import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const USERS_KEY = 'trustissues_users';
const SESSION_KEY = 'trustissues_session';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on app start
        (async () => {
            try {
                const session = await AsyncStorage.getItem(SESSION_KEY);
                if (session) {
                    setUser(JSON.parse(session));
                }
            } catch (e) {
                console.error('Failed to load session:', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const getUsers = async () => {
        try {
            const data = await AsyncStorage.getItem(USERS_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    };

    const signup = async (name, email, password) => {
        const users = await getUsers();

        // Check if email already exists
        if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('An account with this email already exists');
        }

        // Validate inputs
        if (!name.trim()) throw new Error('Name is required');
        if (!email.trim() || !email.includes('@')) throw new Error('Valid email is required');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');

        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password, // In production, hash this!
            createdAt: Date.now(),
        };

        users.push(newUser);
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

        const session = { id: newUser.id, name: newUser.name, email: newUser.email };
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session);
    };

    const login = async (email, password) => {
        const users = await getUsers();
        const found = users.find(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
        );

        if (!found) {
            throw new Error('Invalid email or password');
        }

        const session = { id: found.id, name: found.name, email: found.email };
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session);
    };

    const logout = async () => {
        await AsyncStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
