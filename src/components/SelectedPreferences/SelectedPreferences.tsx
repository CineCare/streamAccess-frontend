import React from "react";
import { Box, Typography, Button, Chip, useTheme } from "@mui/material";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import LanguageIcon from "@mui/icons-material/Language";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setPreference, selectCategoryColors } from "../../providers/store";

const SelectedPreferences: React.FC = () => {
	const dispatch = useDispatch();
	const preferences = useSelector((state: RootState) => state.accessibility.preferences);
	const categoryColors = useSelector(selectCategoryColors);
	const theme = useTheme(); // Récupère le thème MUI

	// Labels des préférences
	const preferenceLabels: {
		[key: string]: {
			[key: string]: string;
		};
	} = {
		general: {
			simplifiedMode: "Mode Simplifié",
			audioGuide: "Guide Audio",
			softMode: "Mode Sensations Douces",
			language: "Langue", // Toujours affiché
		},
		auditory: {
			subtitles: "Sous-titres",
			dialogAmplification: "Amplification des Dialogues",
			hearingAid: "Compatibilité avec Appareils Auditifs",
			visualAlerts: "Notifications Visuelles",
		},
		visual: {
			highContrast: "Mode Contraste Élevé",
			darkMode: "Mode Sombre",
			audioDescription: "Audio Description (AD)",
			fontSize: "Taille de Police", // Toujours affiché
		},
		cognitive: {
			dyslexiaSubtitles: "Sous-titres Dyslexie-Friendly",
			pauseMode: "Mode avec Pauses Automatiques",
			distractionFree: "Interface Sans Distraction",
			contentSummary: "Résumé de Contenu Avant Lecture",
		},
		psychical: {
			filterAnxiety: "Filtrage des Contenus Anxiogènes",
			guidedNavigation: "Navigation Guidée",
			calmAmbiance: "Ambiances Apaisantes",
		},
	};

	// Récupère les préférences activées
	const getSelectedPreferences = () => {
		const selectedPreferences: any[] = [];
		const fixedPreferences: any[] = [];

		Object.entries(preferences).forEach(([category, options]) => {
			Object.entries(options).forEach(([key, value]) => {
				if (value) {
					const label = preferenceLabels[category as keyof typeof preferenceLabels]?.[key];
					if (label) {
						const displayValue = key === "language" || key === "fontSize" ? `${label} : ${value}` : label;
						const chipData = {
							label: displayValue,
							category,
							key,
							removable: !(key === "language" || key === "fontSize"),
							icon:
								key === "fontSize" ? (
									<FormatSizeIcon
										color="inherit"
										fontSize="small"
									/>
								) : key === "language" ? (
									<LanguageIcon
										color="inherit"
										fontSize="small"
									/>
								) : null,
						};

						if (key === "language" || key === "fontSize") {
							fixedPreferences.push(chipData);
						} else {
							selectedPreferences.push(chipData);
						}
					}
				}
			});
		});

		return [...fixedPreferences, ...selectedPreferences];
	};

	// Réinitialisation des préférences
	const handleResetPreferences = () => {
		Object.keys(preferences).forEach(category => {
			Object.keys(preferences[category]).forEach(key => {
				if (key !== "language" && key !== "fontSize") {
					dispatch(setPreference({ category, option: key, value: false }));
				}
			});
		});
	};

	// Sauvegarde des préférences (exemple : API)
	const handleSavePreferences = () => {
		console.log("Préférences sauvegardées :", preferences);
	};

	// Récupère les préférences sélectionnées
	const selectedPreferences = getSelectedPreferences();

	return (
		<Box
			sx={{
				position: "absolute",
				top: 16,
				left: 16,
				zIndex: 1000,
				padding: 2,
				backgroundColor: theme.palette.background.paper,
				borderRadius: 2,
				boxShadow: 3,
				width: "auto",
				maxWidth: "37%",
			}}>
			<Typography
				variant="h6"
				gutterBottom>
				Préférences sélectionnées
			</Typography>

			{/* Affichage des préférences activées */}
			<Box sx={{ marginBottom: 2 }}>
				{selectedPreferences.length > 0 ? (
					selectedPreferences.map(pref => {
						// Récupérer la couleur de la catégorie depuis le thème
						const colorKey = categoryColors[pref.category];
						const paletteColor = theme.palette[colorKey as keyof typeof theme.palette];

						// Vérifier que la couleur est bien un objet avec `.main`
						const chipColor = typeof paletteColor === "object" && "main" in paletteColor ? paletteColor.main : (paletteColor as string);
						const chipTextColor = typeof paletteColor === "object" && "contrastText" in paletteColor ? paletteColor.contrastText : "#FFF";

						return (
							<Chip
								key={pref.key}
								label={pref.label}
								icon={pref.icon || undefined}
								onDelete={pref.removable ? () => dispatch(setPreference({ category: pref.category, option: pref.key, value: false })) : undefined}
								variant={pref.removable ? "outlined" : "filled"}
								sx={{
									margin: 0.5,
									...(pref.removable
										? { borderColor: chipColor, color: chipColor } // Pour "outlined"
										: { backgroundColor: chipColor, color: chipTextColor }), // Pour "filled"
								}}
							/>
						);
					})
				) : (
					<Typography
						variant="body2"
						color="textSecondary">
						Aucune préférence sélectionnée
					</Typography>
				)}
			</Box>

			{/* Boutons de gestion des préférences */}
			<Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
				<Button
					variant="contained"
					color="secondary"
					onClick={handleResetPreferences}>
					Vider toutes les préférences
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSavePreferences}>
					Sauvegarder les préférences
				</Button>
			</Box>
		</Box>
	);
};

export default SelectedPreferences;
