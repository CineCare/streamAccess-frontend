// src/styles/ThemeContext.ts
import { createContext } from "react"; // Suppression de `useContext` inutilisé
import { useDispatch, useSelector } from "react-redux";
import { RootState, setThemePreference } from "../providers/store"; // Import de l'action Redux

// Types pour les thèmes
export type ThemeType = "default" | "highContrast" | "soft" | "lightTheme" | "largeText";

interface ThemeContextProps {
	theme: ThemeType;
	setTheme: (theme: ThemeType) => void;
}

// Créez le contexte
export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Custom hook pour consommer le contexte
export const useThemeContext = () => {
	const dispatch = useDispatch();
	const theme = useSelector((state: RootState) => state.accessibility.preferences.general.theme || "default");

	const setTheme = (newTheme: ThemeType) => {
		dispatch(setThemePreference(newTheme)); // Met à jour le thème dans le store
	};

	return { theme, setTheme };
};
