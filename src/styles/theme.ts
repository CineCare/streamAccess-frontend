import { createTheme } from "@mui/material/styles";

// Thème par défaut
export const defaultTheme = createTheme({
	palette: {
		primary: {
			main: "#007D7D", // Teal plus foncé
			light: "#56B5B6", // Teal plus foncé
		},
		secondary: {
			main: "#AF3D55", // Orange vif pour le contraste
		},
		background: {
			default: "#273340", // Fond sombre pour un contraste élevé
			paper: "#4d5863", // Fond de surface plus clair mais toujours sombre
		},
		text: {
			primary: "#FFFFFF", // Texte clair pour contraster avec les fonds sombres
			secondary: "#B0B0B0", // Texte secondaire gris clair pour moins de contraste
		},
	},
	typography: {
		fontFamily: "'Roboto', sans-serif",
	},
});

// Thème pour accessibilité (exemple : contraste élevé)
export const highContrastTheme = createTheme({
	palette: {
		primary: {
			main: "#000000", // Noir
		},
		secondary: {
			main: "#ffffff", // Blanc
		},
		background: {
			default: "#000000", // Noir pour le fond
		},
		text: {
			primary: "#ffffff", // Blanc pour le texte
		},
	},
});

// Autres thèmes accessibles (ajustez selon vos besoins)
export const largeTextTheme = createTheme({
	typography: {
		fontSize: 18,
		fontFamily: "'Arial', sans-serif",
	},
});
