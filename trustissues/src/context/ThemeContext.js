import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const themes = {
  dark: {
    name: 'dark', bg: '#0F0F23', card: '#1A1A2E', cardAlt: '#252542',
    text: '#FFFFFF', textSecondary: '#9CA3AF', accent: '#A78BFA', accentAlt: '#F472B6',
    green: '#10B981', red: '#EF4444', white: '#F3F4F6', border: '#2D2D4A',
  },
  light: {
    name: 'light', bg: '#FAFAFA', card: '#FFFFFF', cardAlt: '#F3F4F6',
    text: '#111827', textSecondary: '#6B7280', accent: '#7C3AED', accentAlt: '#EC4899',
    green: '#059669', red: '#DC2626', white: '#E5E7EB', border: '#E5E7EB',
  },
  neon: {
    name: 'neon', bg: '#000000', card: '#0A0A0A', cardAlt: '#1A1A1A',
    text: '#00FF88', textSecondary: '#00CC6A', accent: '#FF00FF', accentAlt: '#00FFFF',
    green: '#00FF88', red: '#FF0066', white: '#FFFFFF', border: '#1F1F1F',
  },
  sunset: {
    name: 'sunset', bg: '#1A0F1F', card: '#2D1B2E', cardAlt: '#3D2940',
    text: '#FFF5E1', textSecondary: '#E0A8C0', accent: '#FF6B9D', accentAlt: '#FFA07A',
    green: '#95E1D3', red: '#F38181', white: '#FCE38A', border: '#4A2F4D',
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState('dark');

  useEffect(() => {
    AsyncStorage.getItem('theme').then((val) => {
      if (val && themes[val]) setThemeName(val);
    });
  }, []);

  const changeTheme = async (name) => {
    setThemeName(name);
    await AsyncStorage.setItem('theme', name);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[themeName], themeName, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);