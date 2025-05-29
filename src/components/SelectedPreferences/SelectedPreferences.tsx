import React, { useState } from "react";
import { Box, Typography, Button, Chip, useTheme, Drawer, IconButton } from "@mui/material";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import LanguageIcon from "@mui/icons-material/Language";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setPreference, selectCategoryColors } from "../../providers/store";

const SelectedPreferences: React.FC = () => {
	const dispatch = useDispatch();
	const preferences = useSelector((state: RootState) => state.accessibility.preferences);
	const categoryColors = useSelector(selectCategoryColors);
	const theme = useTheme();

	const [drawerOpen, setDrawerOpen] = useState(false);

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
	type ChipData = {
		label: string;
		category: string;
		key: string;
		removable: boolean;
		icon: JSX.Element | null;
	};

	const getSelectedPreferences = () => {
		const selectedPreferences: ChipData[] = [];
		const fixedPreferences: ChipData[] = [];

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
									<FormatSizeIcon color="inherit" fontSize="small" />
								) : key === "language" ? (
									<LanguageIcon color="inherit" fontSize="small" />
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

	const selectedPreferences = getSelectedPreferences();

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

	// Affichage minimal : Chip avec nombre de préférences actives
	return (
		<>
			<Chip
				label={
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<TuneIcon fontSize="small" />
						<Typography component="span" sx={{ fontWeight: "bold", fontSize: 16 }}>
							Préférences actives
						</Typography>
						<Box
							component="span"
							sx={{
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								width: 26,
								height: 26,
								borderRadius: "50%",
								ml: 0.5,
								backgroundColor: theme.palette.getContrastText(
									theme.palette.mode === "dark"
										? theme.palette.primary.light
										: theme.palette.primary.main
								),
							}}
						>
							<Typography
								component="span"
								sx={{
									fontWeight: "bold",
									fontSize: 16,
									color: theme.palette.mode === "dark"
										? theme.palette.primary.light
										: theme.palette.primary.main,
									lineHeight: 1,
								}}
							>
								{selectedPreferences.length}
							</Typography>
						</Box>
					</Box>
				}
				color="primary"
				variant="filled"
				clickable
				onClick={() => setDrawerOpen(true)}
				sx={{
					position: "absolute",
					top: 16,
					left: 16,
					zIndex: 1200,
					fontWeight: "bold",
					fontSize: 16,
					boxShadow: 2,
					// Amélioration de la visibilité du Chip selon le thème
					backgroundColor: theme.palette.mode === "dark"
						? theme.palette.primary.light
						: theme.palette.primary.main,
					color: theme.palette.getContrastText(
						theme.palette.mode === "dark"
							? theme.palette.primary.light
							: theme.palette.primary.main
					),
					"& .MuiChip-icon": {
						color: theme.palette.getContrastText(
							theme.palette.mode === "dark"
								? theme.palette.primary.light
								: theme.palette.primary.main
						),
					},
				}}
				data-testid="selected-preferences-chip"
			/>

			<Drawer
				anchor="left"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				PaperProps={{
					sx: {
						width: { xs: "90vw", sm: 400 },
						maxWidth: 500,
						padding: 0,
						backgroundColor: theme.palette.background.paper,
						display: "flex",
						flexDirection: "column",
						height: "100%",
					},
				}}
			>
				<Box sx={{ p: 2, flex: "1 1 auto", overflowY: "auto" }}>
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
						<Typography variant="h6" gutterBottom>
							Préférences sélectionnées
						</Typography>
						<IconButton onClick={() => setDrawerOpen(false)} size="small">
							<CloseIcon />
						</IconButton>
					</Box>
					<Box sx={{ marginBottom: 2 }}>
						{selectedPreferences.length > 0 ? (
							selectedPreferences.map(pref => {
								const colorKey = categoryColors[pref.category];
								const paletteColor = theme.palette[colorKey as keyof typeof theme.palette];
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
												? { borderColor: chipColor, color: chipColor }
												: { backgroundColor: chipColor, color: chipTextColor }),
										}}
									/>
								);
							})
						) : (
							<Typography variant="body2" color="textSecondary">
								Aucune préférence sélectionnée
							</Typography>
						)}
					</Box>
				</Box>
				<Box
					sx={{
						p: 2,
						borderTop: `1px solid ${theme.palette.divider}`,
						display: "flex",
						justifyContent: "space-between",
						gap: 2,
						position: "sticky",
						bottom: 0,
						backgroundColor: theme.palette.background.paper,
						zIndex: 1,
					}}
				>
					<Button
						variant="contained"
						color="secondary"
						onClick={handleResetPreferences}
						fullWidth
					>
						Vider toutes les préférences
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSavePreferences}
						fullWidth
					>
						Sauvegarder les préférences
					</Button>
				</Box>
			</Drawer>
		</>
	);
};

export default SelectedPreferences;
