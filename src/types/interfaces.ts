import { ThemeType } from "../styles/ThemeContext";
import { Palette } from "@mui/material";

// Interface pour les films
export interface Movie {
	id: number;
	title: string;
	releaseYear: number;
	image?: string;
	producerId?: number;
	directorId?: number | null;
	shortSynopsis?: string | null;
	longSynopsis?: string | null;
	teamComment?: string | null;
	history?: string | null;
	tags: string[];
}

// Interface pour les erreurs API
export interface ApiError {
	status: number;
	statusText: string;
	message: string;
}

// Interface pour les commentaires
export interface Comment {
	id: number;
	userId: number;
	userName: string;
	userAvatar?: string;
	content: string;
	createdAt: string;
}

export interface ThemeSwitcherProps {
	layout?: "horizontal" | "vertical"; // Définit le style : horizontal ou vertical
	showLabels?: boolean; // Affiche ou masque les labels
	onThemeChange?: (theme: ThemeType) => void;
}

export interface LogoProps {
	customColor?: string;
	width?: number;
	marginRight?: number;
}

// Types pour l'authentification
export interface AuthState {
	isAuthenticated: boolean;
}

// Définition des types pour les catégories de préférences
export interface AccessibilityPreferences {
	[category: string]: {
		[option: string]: boolean | number | string;
	};
}

// Types pour l'état des préférences d'accessibilité
export interface AccessibilityState {
	preferences: AccessibilityPreferences;
}

// Définition des couleurs des catégories basées sur le thème de MUI
export interface AccessibilityColors {
	[category: string]: keyof Palette; // On utilise les clés de la palette MUI
}

// Types pour les notifications
export interface Notification {
	id: number;
	text: string;
	read: boolean;
}

export interface NotificationsState {
	list: Notification[];
}

// Slice pour les films
export interface MoviesState {
	list: Movie[];
}

// Types pour les commentaires
export interface CommentsState {
	list: Comment[];
}

// Types pour les tags
export interface TagsState {
	list: string[];
}

export interface ThemeContextProps {
	theme: ThemeType;
	setTheme: (theme: ThemeType) => void;
}
