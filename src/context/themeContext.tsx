import React, { createContext, useState, useEffect, ReactNode } from 'react';

type ThemeName = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeName;
    setTheme: (name: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeName>('light');

    useEffect(() => {
        const storedTheme = localStorage.getItem('color-theme') as ThemeName;
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
            setTheme(userMedia.matches ? 'dark' : 'light');
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('color-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
