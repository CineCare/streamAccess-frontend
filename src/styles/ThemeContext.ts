// src/styles/ThemeContext.ts
import { createContext, useContext } from "react";

// Types pour les thèmes
type ThemeType = "default" | "highContrast" | "largeText";

interface ThemeContextProps {
	theme: ThemeType;
	setTheme: (theme: ThemeType) => void;
}

// Créez le contexte
export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Custom hook pour consommer le contexte
export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useThemeContext must be used within a ThemeProvider");
	}
	return context;
};
