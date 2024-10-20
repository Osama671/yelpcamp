import { createContext, useContext, useState } from "react";
import allThemes from "../../styles/themeStyles"; //All page themes (css) are in this file

const ThemeContext = createContext("");
const themes = allThemes;
const mapboxTheme = {
  light: "mapbox://styles/mapbox/streets-v12",
  dark: "mapbox://styles/mapbox/standard-satellite",
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [styles, setStyles] = useState(themes[theme]);
  const [mapboxStyle, setMapboxStyle] = useState(mapboxTheme[theme]);

  const changeTheme = () => {
    const newtheme = theme === "light" ? "dark" : "light";
    setTheme(newtheme);
    setStyles(themes[theme]);
    setMapboxStyle(mapboxTheme[theme]);
  };
  return (
    <ThemeContext.Provider value={{ styles, changeTheme, mapboxStyle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
