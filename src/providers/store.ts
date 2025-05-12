import { configureStore, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Utilisation de localStorage
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { AuthState, AccessibilityState, AccessibilityColors, MoviesState, Comment } from "../types/interfaces";
import { fetchAllMovies } from "../services/FetcherService";
import { initialNotificationsState, initialTagsState } from "../data/mockData";

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

// Fonction pour récupérer le thème depuis localStorage
const getInitialTheme = (): string => {
	if (typeof window !== "undefined" && localStorage) {
		const savedTheme = localStorage.getItem("theme");
		return savedTheme || "default";
	}
	return "default";
};

// État initial pour les préférences d'accessibilité
const initialAccessibilityState: AccessibilityState = {
	preferences: {
		general: {
			theme: getInitialTheme(), // Récupère le thème depuis localStorage
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
		setThemePreference: (state, action: PayloadAction<string>) => {
			state.preferences.general.theme = action.payload; // Met à jour le thème dans Redux
			localStorage.setItem("theme", action.payload); // Sauvegarde le thème dans localStorage
		},
	},
});

export const { setPreference, setThemePreference } = accessibilitySlice.actions;

// Slice utilisateur
const userSlice = createSlice({
	name: "user",
	initialState: {
		name: "",
		email: "",
		avatar: localStorage.getItem("userAvatar") || null, // Null déclenchera l'affichage de l'icône
	},
	reducers: {
		setUserAvatar: (state, action) => {
			state.avatar = action.payload; // Peut être null
			if (action.payload) {
				localStorage.setItem("userAvatar", action.payload);
			} else {
				localStorage.removeItem("userAvatar");
			}
		},
		setUserInfo: (state, action: PayloadAction<{ name: string; email: string }>) => {
			state.name = action.payload.name;
			state.email = action.payload.email;
		},
	},
});

export const { setUserAvatar, setUserInfo } = userSlice.actions;

const initialMoviesState: MoviesState = {
	list: [],
};

// Thunk pour récupérer les films
export const fetchMovies = createAsyncThunk("movies/fetchMovies", async (_, { rejectWithValue }) => {
	try {
		return await fetchAllMovies();
	} catch (error) {
		return rejectWithValue(error instanceof Error ? error.message : "Erreur inconnue");
	}
});

const moviesSlice = createSlice({
	name: "movies",
	initialState: initialMoviesState,
	reducers: {
		removeMovie: (state, action: PayloadAction<number>) => {
			state.list = state.list.filter(movie => movie.id !== action.payload); // Supprime le film localement
		},
	},
	extraReducers: builder => {
		builder.addCase(fetchMovies.fulfilled, (state, action) => {
			state.list = action.payload;
		});
	},
});

export const { removeMovie } = moviesSlice.actions; // Exporter l'action

export const moviesReducer = moviesSlice.reducer;

// Slice pour les notifications
const notificationsSlice = createSlice({
	name: "notifications",
	initialState: initialNotificationsState,
	reducers: {
		markNotificationAsRead: (state, action: PayloadAction<number>) => {
			const notification = state.list.find(n => n.id === action.payload);
			if (notification) {
				notification.read = true;
			}
		},
		markAllNotificationsAsRead: state => {
			state.list.forEach(notification => {
				notification.read = true;
			});
		},
	},
});

export const { markNotificationAsRead, markAllNotificationsAsRead } = notificationsSlice.actions;

// Slice pour les commentaires
const commentsSlice = createSlice({
	name: "comments",
	initialState: {} as { list: [] } as { list: Comment[] },
	reducers: {
		addComment: (state, action: PayloadAction<Comment>) => {
			state.list.unshift(action.payload);
		},
	},
});

export const { addComment } = commentsSlice.actions;

const tagsSlice = createSlice({
	name: "tags",
	initialState: initialTagsState,
	reducers: {},
});

export const tagsReducer = tagsSlice.reducer;

// Combine reducers
const rootReducer = combineReducers({
	auth: persistReducer(authPersistConfig, authSlice.reducer),
	user: persistReducer(userPersistConfig, userSlice.reducer),
	accessibility: accessibilitySlice.reducer,
	colors: colorsSlice.reducer,
	movies: moviesReducer,
	notifications: notificationsSlice.reducer,
	comments: commentsSlice.reducer,
	tags: tagsReducer,
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
export const selectComments = (state: RootState) => state.comments.list;
export default store;
