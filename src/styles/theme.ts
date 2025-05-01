import { createTheme } from "@mui/material/styles";

// Thème par défaut
export const defaultTheme = createTheme({
	palette: {
		primary: {
			main: "#007D7D", // 🌿 Conservé (vert du logo)
			light: "#56B5B6", // 💙 Version plus douce
		},
		secondary: {
			main: "#D4A5A5", // 🌸 Rose poudré, apaisant
		},
		success: {
			main: "#A5D6A7", // 🌱 Vert pastel
		},
		info: {
			main: "#C5B3E6", // 💜 Lavande douce
		},
		warning: {
			main: "#E6C19C", // 🍂 Beige doré, plus tendre que l’orange
		},
		error: {
			main: "#E57373", // 🌺 Rouge rosé (moins agressif)
		},
		background: {
			default: "#273340", // 🌑 Conservé
			paper: "#4D5863", // ☁ Conservé
		},
		text: {
			primary: "#FFFFFF", // ⚪ Conservé
			secondary: "#D1D1D1", // 🔘 Gris clair, plus doux
		},
	},
	typography: {
		fontFamily: "'Roboto', sans-serif",
	},
});

export const softTheme = createTheme({
	palette: {
		primary: {
			main: "#6A89CC",
			light: "#A8C0E6",
		},
		secondary: {
			main: "#E66767",
		},
		success: {
			main: "#589b67",
		},
		info: {
			main: "#6c6693",
		},
		warning: {
			main: "#EAB543",
		},
		error: {
			main: "#EA8685",
		},
		background: {
			default: "#e1eaf2",
			paper: "#DADFE1",
		},
		text: {
			primary: "#2C3A47",
			secondary: "#596275",
		},
	},
	typography: {
		fontFamily: "'Poppins', sans-serif",
	},
});

// Suggestion : Ajouter des commentaires pour expliquer les choix de couleurs
// Exemple : Le contraste élevé est conçu pour les utilisateurs ayant des déficiences visuelles.
export const highContrastTheme = createTheme({
	palette: {
		primary: {
			main: "#FFD700", // 🟡 Doré - Conservé
			light: "#FFEA70",
			dark: "#C6A600",
			contrastText: "#000000", // Texte noir sur fond doré
		},
		secondary: {
			main: "#007BFF", // 🔵 Bleu électrique pour un bon contraste
			light: "#66B2FF",
			dark: "#0056B3",
			contrastText: "#FFFFFF", // Texte blanc pour lisibilité
		},
		success: {
			main: "#00FF00", // 🟢 Vert néon - Conservé
			contrastText: "#000000",
		},
		info: {
			main: "#00BFFF", // 🔵 Bleu clair néon - Conservé
			contrastText: "#000000",
		},
		warning: {
			main: "#FF00FF", // 🌸 Magenta vif pour un fort contraste
			contrastText: "#FFFFFF",
		},
		error: {
			main: "#FF2400", // 🔴 Rouge néon (plus fort que Crimson)
			contrastText: "#FFFFFF",
		},
		background: {
			default: "#000000", // ⚫ Fond noir - Conservé
			paper: "#1A1A1A", // 🌑 Un noir moins profond pour éviter la fatigue visuelle
		},
		text: {
			primary: "#FFFFFF", // ⚪ Blanc pour un contraste maximal
			secondary: "#FFD700", // 🟡 Doré pour un accent visuel clair
		},
		action: {
			active: "#FFFFFF",
			hover: "#FF4500",
			selected: "#FFD700",
			disabled: "#666666",
			disabledBackground: "#333333",
		},
	},
	typography: {
		fontFamily: "'Arial Black', sans-serif",
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: "6px",
					textTransform: "none",
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				indicator: {
					backgroundColor: "#FFD700",
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontWeight: "bold",
				},
			},
		},
	},
});

export const lightTheme = createTheme({
	palette: {
		primary: {
			main: "#007D7D", // 🔵 Cyan foncé pour garder l’identité
			light: "#56B5B6",
			dark: "#005F5F",
			contrastText: "#FFFFFF",
		},
		secondary: {
			main: "#805AD5", // 🟣 Violet doux et moderne
			light: "#B794F4",
			dark: "#553C9A",
			contrastText: "#FFFFFF",
		},
		success: {
			main: "#2D9C6B", // 🟢 Vert feuille, doux et naturel
			contrastText: "#FFFFFF",
		},
		info: {
			main: "#3182CE", // 🔵 Bleu clair moderne
			contrastText: "#FFFFFF",
		},
		warning: {
			main: "#D69E2E", // 🟠 Jaune-orangé doux
			contrastText: "#1A202C",
		},
		error: {
			main: "#E53E3E", // 🔴 Rouge accessible
			contrastText: "#FFFFFF",
		},
		background: {
			default: "#F7FAFC", // ⚪ Gris très clair
			paper: "#E2E8F0", // 🌫️ Gris perle léger
		},
		text: {
			primary: "#1A202C", // ⚫ Noir charbon
			secondary: "#4A5568", // ⚫ Gris anthracite
		},
		action: {
			active: "#1A202C",
			hover: "#D69E2E",
			selected: "#805AD5",
			disabled: "#A0AEC0",
			disabledBackground: "#CBD5E0",
		},
	},
	typography: {
		fontFamily: "'Roboto', sans-serif",
	},
});

// Autres thèmes accessibles (ajustez selon vos besoins)
export const largeTextTheme = createTheme({
	typography: {
		fontSize: 18,
		fontFamily: "'Arial', sans-serif",
	},
});
