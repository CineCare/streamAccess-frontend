// src/styles/ThemeContext.ts
import { createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setThemePreference } from "../providers/store";
import { ThemeContextProps } from "../types/interfaces"; // Import des types d'interface

export type ThemeType = "default" | "highContrast" | "soft" | "lightTheme" | "largeText";

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useThemeContext = () => {
	const dispatch = useDispatch();
	const theme = useSelector((state: RootState) => state.accessibility.preferences.general.theme || "default");

	const setTheme = (newTheme: ThemeType) => {
		dispatch(setThemePreference(newTheme)); // Met à jour le thème dans le store
	};

	return { theme, setTheme };
};
