import { createContext, useContext, useState } from "react";

const ThemeContext = createContext("");

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({});
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext)
