import React from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import LanguageIcon from '@mui/icons-material/Language';
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
			language: "Langue", // Doit rester affiché
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
			fontSize: "Taille de Police", // Doit rester affiché
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

	const getSelectedPreferences = () => {
		const selectedPreferences: any[] = [];
		const fixedPreferences: any[] = [];
	
		Object.entries(preferences).forEach(([category, options]) => {
			Object.entries(options).forEach(([key, value]) => {
				if (value) {
					const label = preferenceLabels[category]?.[key];
					if (label) {
						const displayValue = key === "language" || key === "fontSize" ? `${label} : ${value}` : label;
						const chipData = { 
							label: displayValue, 
							category, 
							key, 
							removable: !(key === "language" || key === "fontSize"),
							icon: key === "fontSize" ? <FormatSizeIcon fontSize="small" color="primary" /> : key === "language" ? <LanguageIcon fontSize="small" color="primary" /> : null,
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

	const handleResetPreferences = () => {
		Object.keys(preferences).forEach(category => {
			Object.keys(preferences[category]).forEach(key => {
				if (key !== "language" && key !== "fontSize") {
					dispatch(setPreference({ category, option: key, value: false }));
				}
			});
		});
	};

	const handleSavePreferences = () => {
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

			<Box sx={{ marginBottom: 2 }}>
				{selectedPreferences.length > 0 ? (
					selectedPreferences.map(pref => (
						<Chip
							key={pref.key}
							label={pref.label}
							icon={pref.icon}
							onDelete={pref.removable ? () => dispatch(setPreference({ category: pref.category, option: pref.key, value: false })) : undefined}
							sx={{ margin: 0.5 }}
							variant={pref.removable ? "outlined" : "filled"}
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
