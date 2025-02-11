// src/styles/AccessibilityThemeManager.tsx
import React, { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { defaultTheme, highContrastTheme, largeTextTheme } from "./theme";
import { ThemeContext } from "./ThemeContext";

export const AccessibilityThemeManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"default" | "highContrast" | "largeText">("default");

  const currentTheme = useMemo(() => {
    switch (theme) {
      case "highContrast":
        return highContrastTheme;
      case "largeText":
        return largeTextTheme;
      default:
        return defaultTheme;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
