import {useContext} from "react";
import {ThemeContext} from "../context/themeContext.tsx";

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('Must be used within ThemeProvider');
    return context;
};