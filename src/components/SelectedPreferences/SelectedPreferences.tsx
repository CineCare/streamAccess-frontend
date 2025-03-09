import React from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setPreference } from "../../providers/store";

const SelectedPreferences: React.FC = () => {
	const dispatch = useDispatch();
	const preferences = useSelector((state: RootState) => state.accessibility.preferences);

	type PreferenceLabels = {
		[category: string]: {
			[key: string]: string;
		};
	};

	const preferenceLabels: PreferenceLabels = {
		general: {
			simplifiedMode: "Mode Simplifié",
			audioGuide: "Guide Audio",
			softMode: "Mode Sensations Douces",
			language: "Langue",
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
			fontSize: "Taille de Police",
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

	// Récupérer les préférences sélectionnées
	const getSelectedPreferences = () => {
		const selectedPreferences: any[] = [];
		// Parcours des catégories de préférences
		Object.entries(preferences).forEach(([category, options]) => {
			Object.entries(options).forEach(([key, value]) => {
				if (value) {
					// Utiliser le mapping pour obtenir le label et ajouter l'option sélectionnée
					const label = preferenceLabels[category]?.[key];
					if (label) {
						selectedPreferences.push({ label, category, key });
					}
				}
			});
		});
		return selectedPreferences;
	};

	const handleResetPreferences = () => {
		// Réinitialiser toutes les préférences à false
		Object.keys(preferences).forEach(category => {
			Object.keys(preferences[category]).forEach(key => {
				dispatch(setPreference({ category, option: key, value: false }));
			});
		});
	};

	const handleSavePreferences = () => {
		// Sauvegarder les préférences (exemple : envoyer à une API)
		console.log("Préférences sauvegardées :", preferences);
	};

	const selectedPreferences = getSelectedPreferences();

	return (
		<Box
			sx={{
				position: "absolute",
				top: 16,
				left: 16,
				zIndex: 1000,
				padding: 2,
				backgroundColor: theme => theme.palette.background.paper,
				borderRadius: 2,
				boxShadow: 3,
				width: "auto",
				maxWidth: "35%",
			}}>
			<Typography
				variant="h6"
				gutterBottom>
				Préférences sélectionnées
			</Typography>

			{/* Affichage des préférences sélectionnées avec des Chips */}
			<Box sx={{ marginBottom: 2 }}>
				{selectedPreferences.length > 0 ? (
					selectedPreferences.map(pref => (
						<Chip
							key={pref.key}
							label={pref.label}
							onDelete={() => dispatch(setPreference({ category: pref.category, option: pref.key, value: false }))}
							sx={{ margin: 0.5 }}
						/>
					))
				) : (
					<Typography
						variant="body2"
						color="textSecondary">
						Aucune préférence sélectionnée
					</Typography>
				)}
			</Box>

			{/* Boutons pour réinitialiser et sauvegarder */}
			<Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
				<Button
					variant="outlined"
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
