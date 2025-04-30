import { Palette } from "@mui/material";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Utilisation de localStorage
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

// Types pour l'authentification
interface AuthState {
	isAuthenticated: boolean;
}

// Définition des types pour les catégories de préférences
interface AccessibilityPreferences {
	[category: string]: {
		[option: string]: boolean | number | string;
	};
}

// Types pour l'état des préférences d'accessibilité
interface AccessibilityState {
	preferences: AccessibilityPreferences;
}

// Définition des couleurs des catégories basées sur le thème de MUI
interface AccessibilityColors {
	[category: string]: keyof Palette; // On utilise les clés de la palette MUI
}

// État initial pour l'authentification (removed as it was unused)

// État initial pour les couleurs des catégories
const initialColorsState: AccessibilityColors = {
	psychical: "success",
	auditory: "info",
	cognitive: "secondary",
	visual: "warning",
	general: "primary",
};

// Configuration de redux-persist pour l'authentification
const authPersistConfig = {
	key: "auth",
	storage,
};

// Configuration de redux-persist pour l'utilisateur
const userPersistConfig = {
	key: "user",
	storage,
};

// Slice des couleurs des catégories
const colorsSlice = createSlice({
	name: "colors",
	initialState: initialColorsState,
	reducers: {},
});

// Slice d'authentification
const authSlice = createSlice({
	name: "auth",
	initialState: { isAuthenticated: false } as AuthState,
	reducers: {
		login: state => {
			state.isAuthenticated = true;
		},
		logout: state => {
			state.isAuthenticated = false;
		},
	},
});

export const { login, logout } = authSlice.actions;

// État initial pour les préférences d'accessibilité
const initialAccessibilityState: AccessibilityState = {
	preferences: {
		general: {
			simplifiedMode: false,
			audioGuide: false,
			softMode: false,
			language: "fr",
		},
		auditory: {
			subtitles: false,
			dialogAmplification: false,
			hearingAid: false,
			visualAlerts: false,
		},
		visual: {
			highContrast: false,
			darkMode: false,
			audioDescription: false,
			fontSize: 14,
		},
		cognitive: {
			dyslexiaSubtitles: false,
			pauseMode: false,
			distractionFree: false,
			contentSummary: false,
		},
		psychical: {
			filterAnxiety: false,
			guidedNavigation: false,
			calmAmbiance: false,
		},
	},
};

// Slice pour les préférences d'accessibilité
const accessibilitySlice = createSlice({
	name: "accessibility",
	initialState: initialAccessibilityState,
	reducers: {
		setPreference: (state, action: PayloadAction<{ category: string; option: string; value: boolean | string | number }>) => {
			const { category, option, value } = action.payload;
			if (state.preferences[category] && state.preferences[category][option] !== undefined) {
				state.preferences[category][option] = value; // On s'assure de bien mettre à jour la valeur boolean
			}
		},
	},
});

export const { setPreference } = accessibilitySlice.actions;

// Slice utilisateur
const userSlice = createSlice({
	name: "user",
	initialState: {
		name: "",
		email: "",
		avatar: "https://i.pravatar.cc/300?img=68", // Avatar par défaut
	},
	reducers: {
		setUserAvatar: (state, action) => {
			state.avatar = action.payload;
		},
		setUserInfo: (state, action: PayloadAction<{ name: string; email: string }>) => {
			state.name = action.payload.name;
			state.email = action.payload.email;
		},
	},
});

export const { setUserAvatar, setUserInfo } = userSlice.actions;

// Combine reducers
const rootReducer = combineReducers({
	auth: persistReducer(authPersistConfig, authSlice.reducer),
	user: persistReducer(userPersistConfig, userSlice.reducer),
	accessibility: accessibilitySlice.reducer,
	colors: colorsSlice.reducer,
});

// Configuration du store avec middleware pour ignorer les actions non sérialisables
const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore les actions redux-persist
			},
		}),
});

export const persistor = persistStore(store);

// Types pour les sélecteurs et dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// Sélecteur pour récupérer les couleurs
export const selectCategoryColors = (state: RootState) => state.colors;
export default store;
