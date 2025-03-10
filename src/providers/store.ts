import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types pour l'authentification
interface AuthState {
	isAuthenticated: boolean;
}

// Types pour les préférences d'accessibilité
// Définition des types des options de préférence
interface PreferenceOption {
	key: string;
	label: string;
	value: boolean | number | string;
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

// État initial pour l'authentification
const initialAuthState: AuthState = {
	isAuthenticated: false,
};

// Slice d'authentification
const authSlice = createSlice({
	name: "auth",
	initialState: initialAuthState,
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

// Configuration du store
const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		accessibility: accessibilitySlice.reducer,
	},
});

// Types pour les sélecteurs et dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
