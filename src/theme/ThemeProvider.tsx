import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors, darkColors, ThemeColors } from './colors';

type ThemeContextType = {
    colors: ThemeColors;
    isDark: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const colorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(colorScheme === 'dark');

    // Update theme when system theme changes
    useEffect(() => {
        setIsDark(colorScheme === 'dark');
    }, [colorScheme]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    const themeColors = isDark ? darkColors : colors;

    return (
        <ThemeContext.Provider value={{ colors: themeColors, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};