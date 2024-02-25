import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext = createContext(null);

const ThemeContextProvider = ({ children }) => {
  const defaultTheme = {
    name: "default",
    price: 0,
    colors: null,
  };

  const { get: getPurchasedThemes, set: savePurchasedThemes } =
    useLocalStorage("purchasedThemes");
  const { get: getCurrentTheme, set: saveCurrentTheme } =
    useLocalStorage("defaultTheme");

  const [currentTheme, setCurrentTheme] = useState(
    getCurrentTheme() || defaultTheme
  );
  const [purchasedThemes, setPurchasedThemes] = useState(
    getPurchasedThemes() || []
  );

  // function to buy a theme from the store
  const buyTheme = (theme) => {
    setPurchasedThemes((prev) => {
      const newState = [...prev, theme];
      return newState;
    });
  };

  // function to set the user's current theme
  const setTheme = (theme) => {
    setCurrentTheme(theme);
  };

  // This useEffect saves the purchasedThemes to localStorage so it persists after window is closed
  useEffect(() => {
    savePurchasedThemes(purchasedThemes);
  }, [purchasedThemes]);

  // This useEffect saves the currentTheme to localStorage
  useEffect(() => {
    saveCurrentTheme(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, buyTheme, setTheme, purchasedThemes }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
