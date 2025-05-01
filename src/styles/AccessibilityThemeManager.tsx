// src/styles/AccessibilityThemeManager.tsx
import React, { useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setThemePreference } from "../providers/store"; // Import de l'action Redux
import { defaultTheme, highContrastTheme, softTheme, largeTextTheme, lightTheme } from "./theme";
import { ThemeContext, ThemeType } from "./ThemeContext"; // Import du type ThemeType

export const AccessibilityThemeManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.accessibility.preferences.general.theme || "default") as ThemeType;

  // Mettre à jour le contexte avec le thème actuel
  const contextValue = useMemo(
    () => ({
      theme,
      setTheme: (newTheme: ThemeType) => {
        dispatch(setThemePreference(newTheme)); // Met à jour le thème dans le store Redux
      },
    }),
    [theme, dispatch]
  );

  // Déterminer le thème actuel
  const currentTheme = useMemo(() => {
    switch (theme) {
      case "highContrast":
        return highContrastTheme;
      case "soft":
        return softTheme;
      case "lightTheme":
        return lightTheme;
      case "largeText":
        return largeTextTheme;
      case "default":
        return defaultTheme;
      default:
        console.error(`Thème inconnu : ${theme}. Utilisation du thème par défaut.`);
        return defaultTheme;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
