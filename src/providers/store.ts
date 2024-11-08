import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types pour l'authentification
interface AuthState {
	isAuthenticated: boolean;
}

// Types pour les préférences d'accessibilité
interface AccessibilityPreferences {
	[category: string]: {
		[option: string]: unknown;
	};
}

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
	preferences: {},
};

// Slice pour les préférences d'accessibilité
const accessibilitySlice = createSlice({
	name: "accessibility",
	initialState: initialAccessibilityState,
	reducers: {
		setPreference: (state, action: PayloadAction<{ category: string; option: string; value: unknown }>) => {
			const { category, option, value } = action.payload;
			if (!state.preferences[category]) {
				state.preferences[category] = {};
			}
			state.preferences[category][option] = value;
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
