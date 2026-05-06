import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const themes = {
    cyber: {
        bg: '#000000',
        card: '#0a0a0a',
        cardAlt: '#111111',
        text: '#ffffff',
        textSecondary: '#888888',
        accent: '#ccff00',
        accentAlt: '#00e5ff',
        green: '#ccff00',
        red: '#ff0055',
        white: '#aaaaaa',
        border: '#222222',
    },
    dark: {
        bg: '#0d0d0d',
        card: '#1a1a2e',
        cardAlt: '#16213e',
        text: '#eaeaea',
        textSecondary: '#8d8d9b',
        accent: '#e94560',
        accentAlt: '#0f3460',
        green: '#00b894',
        red: '#e74c3c',
        white: '#a0a0a0',
        border: '#2a2a3e',
    },
    light: {
        bg: '#f5f5f5',
        card: '#ffffff',
        cardAlt: '#eef2f7',
        text: '#1a1a2e',
        textSecondary: '#6b7280',
        accent: '#e94560',
        accentAlt: '#0f3460',
        green: '#00b894',
        red: '#e74c3c',
        white: '#a0a0a0',
        border: '#e0e0e0',
    },
    midnight: {
        bg: '#0a0a1a',
        card: '#111128',
        cardAlt: '#1a1a3e',
        text: '#e0e0ff',
        textSecondary: '#7878a0',
        accent: '#7c3aed',
        accentAlt: '#2563eb',
        green: '#10b981',
        red: '#ef4444',
        white: '#9ca3af',
        border: '#252550',
    },
    sunset: {
        bg: '#1a0a0a',
        card: '#2d1515',
        cardAlt: '#3d1f1f',
        text: '#ffe0d0',
        textSecondary: '#b08070',
        accent: '#f97316',
        accentAlt: '#ef4444',
        green: '#22c55e',
        red: '#dc2626',
        white: '#9ca3af',
        border: '#4a2020',
    },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [themeName, setThemeName] = useState('cyber');

    useEffect(() => {
        AsyncStorage.getItem('theme').then((val) => {
            if (val && themes[val]) setThemeName(val);
        });
    }, []);

    const changeTheme = async (name) => {
        if (themes[name]) {
            setThemeName(name);
            await AsyncStorage.setItem('theme', name);
        }
    };

    const theme = themes[themeName];

    return (
        <ThemeContext.Provider value={{ theme, themeName, changeTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);