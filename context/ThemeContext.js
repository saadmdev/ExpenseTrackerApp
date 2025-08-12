// context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

const LIGHT = {
  mode: "light",
  background: "#FFFFFF",
  text: "#000000",
  card: "#F6F6F6",
  border: "#E6E6E6",
  accent: "#6A4E9C", // purple accent
  success: "#2EBE7A",
  danger: "#FF6F61",
  calendarSelected: "#EDEDED", // lighter gray for calendar in light mode
  progress: "#6A4E9C",
  placeholder: "#666666",
};

const DARK = {
  mode: "dark",
  background: "#0F0F10",
  text: "#FFFFFF",
  card: "#1E1E1E",
  border: "#2E2E2E",
  accent: "#BB86FC",
  success: "#2EBE7A",
  danger: "#FF6F61",
  calendarSelected: "#3A3A3A",
  progress: "#BB86FC",
  placeholder: "#AAAAAA",
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");
  const [theme, setTheme] = useState(LIGHT);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("@theme_mode");
        if (saved) setMode(saved);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    setTheme(mode === "dark" ? DARK : LIGHT);
    AsyncStorage.setItem("@theme_mode", mode).catch(() => {});
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
