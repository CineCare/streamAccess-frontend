// src/styles/AccessibilityThemeManager.tsx
import React, { useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setThemePreference } from "../providers/store"; // Import de l'action Redux
import { createAccessibleTheme } from "./theme";
import { ThemeContext, ThemeType } from "./ThemeContext"; // Import du type ThemeType

export const AccessibilityThemeManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const preferences = useSelector((state: RootState) => state.accessibility.preferences);

  const allowedThemes: ThemeType[] = ["default", "highContrast", "soft", "lightTheme", "largeText"];
  const rawTheme = preferences.general?.theme;
  const themeName: ThemeType = allowedThemes.includes(rawTheme as ThemeType) ? (rawTheme as ThemeType) : "default";

  const contextValue = useMemo(
    () => ({
      theme: themeName,
      setTheme: (newTheme: ThemeType) => {
        dispatch(setThemePreference(newTheme));
      },
    }),
    [themeName, dispatch]
  );

  // Générer dynamiquement le thème selon toutes les préférences
  const currentTheme = useMemo(() => createAccessibleTheme(preferences), [preferences]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
