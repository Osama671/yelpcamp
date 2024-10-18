import { createContext, useContext, useState } from "react";
import lightStyles from "../../styles/lightTheme/campgrounds.module.css";
import darkStyles from "../../styles/darkTheme/campgrounds.module.css";

const ThemeContext = createContext("");

const themes = { light: lightStyles, dark: darkStyles };

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [styles, setStyles] = useState(themes[theme]);

  const changeTheme = () => {
    const newtheme = theme === "light" ? "dark" : "light";
    setTheme(newtheme);
    setStyles(themes[theme]);
  };
  return (
    <ThemeContext.Provider value={{styles, changeTheme}}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
