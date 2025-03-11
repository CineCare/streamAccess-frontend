import { useDispatch, useSelector } from "react-redux";
import { Container, Box, Typography, Tabs, Tab, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, Slider, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { RootState, setPreference, selectCategoryColors } from "../../providers/store";
import { useTheme, PaletteColor } from "@mui/material/styles";

// Configuration des options d'accessibilité
const accessibilityOptions = {
	general: [
		{ key: "simplifiedMode", label: "Mode Accessibilité Simplifié - Active des options adaptées pour un usage facilité." },
		{ key: "audioGuide", label: "Guide Audio Simplifié - Fournit des instructions vocales pour la navigation." },
		{ key: "softMode", label: "Mode Sensations Douces - Réduit les animations et ajuste les couleurs pour un effet apaisant." },
	],
	auditory: [
		{ key: "subtitles", label: "Sous-titres Activables - Permet d'afficher des sous-titres pour les dialogues et les sons." },
		{ key: "dialogAmplification", label: "Amplification des Dialogues - Renforce les voix dans les contenus audio." },
		{ key: "hearingAid", label: "Compatibilité avec Appareils Auditifs - Ajuste le son pour les appareils compatibles." },
		{ key: "visualAlerts", label: "Notifications Visuelles - Remplace les alertes sonores par des signaux visuels." },
	],
	visual: [
		{ key: "highContrast", label: "Mode Contraste Élevé - Améliore la visibilité des textes et des éléments." },
		{ key: "darkMode", label: "Mode Sombre - Réduit la luminosité de l'interface." },
		{ key: "audioDescription", label: "Audio Description (AD) - Active les descriptions vocales pour les éléments visuels." },
	],
	cognitive: [
		{ key: "dyslexiaSubtitles", label: "Sous-titres Dyslexie-Friendly - Utilise des polices adaptées aux personnes dyslexiques." },
		{ key: "pauseMode", label: "Mode de Visionnage avec Pauses Automatiques - Ajoute des pauses dans les contenus pour permettre une meilleure assimilation." },
		{ key: "distractionFree", label: "Interface Sans Distraction - Affiche uniquement les éléments essentiels." },
		{ key: "contentSummary", label: "Résumé de Contenu Avant Lecture - Fournit un résumé rapide des contenus avant le visionnage." },
	],
	psychical: [
		{ key: "filterAnxiety", label: "Filtrage des Contenus Anxiogènes - Masque ou avertit pour les contenus potentiellement stressants." },
		{ key: "guidedNavigation", label: "Navigation Guidée - Simplifie la navigation avec des indications étape par étape." },
		{ key: "calmAmbiance", label: "Ambiances Apaisantes - Ajuste les effets sonores et visuels pour réduire le stress." },
	],
};

// Titres des onglets
const tabTitles = ["Général", "Paramètres Sensoriels - Auditif", "Paramètres Sensoriels - Visuel", "Paramètres Cognitifs", "Paramètres Psychiques"];

const AccessibilityOptions: React.FC = () => {
	const dispatch = useDispatch();
	const preferences = useSelector((state: RootState) => state.accessibility.preferences);
	const categoryColors = useSelector(selectCategoryColors);
	const theme = useTheme();

	const [accessibilityTab, setAccessibilityTab] = useState(0);
	const [fontSize, setFontSize] = useState<number>(typeof preferences.visual?.fontSize === "number" ? preferences.visual.fontSize : 14);
	const [language, setLanguage] = useState<string>(typeof preferences.general?.language === "string" ? preferences.general.language : "fr");

	// Changement d'onglet
	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setAccessibilityTab(newValue);
	};

	// Changement d'option
	const handlePreferenceChange = (category: string, option: string, value: unknown) => {
		dispatch(setPreference({ category, option, value: value as string | number | boolean }));
	};

	// Changement de langue
	const handleLanguageChange = (event: SelectChangeEvent<string>) => {
		const newLanguage = event.target.value as string;
		setLanguage(newLanguage);
		dispatch(setPreference({ category: "general", option: "language", value: newLanguage }));
	};

	return (
		<Container maxWidth="lg">
			{/* Onglets avec couleur dynamique */}
			<Tabs
				value={accessibilityTab}
				onChange={handleTabChange}
				textColor="inherit"
				variant="scrollable"
				scrollButtons="auto"
				sx={{
					"& .MuiTabs-indicator": {
						backgroundColor: (theme.palette[categoryColors[Object.keys(accessibilityOptions)[accessibilityTab]]] as PaletteColor)?.main, // Couleur sous l'onglet actif
					},
					"& .MuiTab-root.Mui-selected": {
						color: (theme.palette[categoryColors[Object.keys(accessibilityOptions)[accessibilityTab]]] as PaletteColor)?.main, // Texte de l'onglet actif
					},
				}}>
				{tabTitles.map((title, index) => (
					<Tab
						key={index}
						label={title}
					/>
				))}
			</Tabs>

			<Box marginTop={2}>
				{Object.entries(accessibilityOptions).map(([category, options], index) =>
					accessibilityTab === index ? (
						<Card
							key={category}
							sx={{ mb: 3, "&:hover": { boxShadow: 3 } }}>
							<CardContent>
								<Typography
									variant="h5"
									gutterBottom>
									{tabTitles[index]} {/* Affiche le titre correspondant */}
								</Typography>
								<FormGroup>
									{options.map(({ key, label }) => {
										// Récupérer la couleur de la catégorie depuis le thème
										const colorKey = categoryColors[category]; // Ex: "primary", "success", etc.
										const paletteColor = theme.palette[colorKey as keyof typeof theme.palette];

										// Vérifier que la couleur a bien une propriété "main"
										const checkboxColor = typeof paletteColor === "object" && "main" in paletteColor ? paletteColor.main : String(paletteColor);

										return (
											<FormControlLabel
												key={key}
												control={
													<Checkbox
														checked={Boolean(preferences[category]?.[key])}
														onChange={e => handlePreferenceChange(category, key, e.target.checked)}
														sx={{
															color: checkboxColor,
															"&.Mui-checked": {
																color: checkboxColor,
															},
														}}
													/>
												}
												label={label}
											/>
										);
									})}
									{category === "visual" && (
										<Box marginTop={2}>
											<Typography variant="body1">Taille de la police</Typography>
											<Slider
												value={fontSize}
												onChange={(_e, value) => setFontSize(value as number)}
												onChangeCommitted={(_e, value) => {
													if (typeof value === "number") {
														dispatch(setPreference({ category: "visual", option: "fontSize", value }));
													}
												}}
												min={12}
												max={24}
												valueLabelDisplay="auto"
												sx={{
													color: (theme.palette[categoryColors["visual"]] as PaletteColor).main, // ✅ Applique la couleur dynamique
													"& .MuiSlider-thumb": {
														backgroundColor: (theme.palette[categoryColors["visual"]] as PaletteColor).main, // ✅ Change la couleur du curseur
													},
													"& .MuiSlider-track": {
														backgroundColor: (theme.palette[categoryColors["visual"]] as PaletteColor).main, // ✅ Change la couleur de la barre
													},
													"& .MuiSlider-rail": {
														backgroundColor: (theme.palette[categoryColors["visual"]] as PaletteColor).light, // ✅ Ajuste le rail
													},
												}}
											/>
										</Box>
									)}
									{category === "general" && (
										<Box
											marginBottom={2}
											marginTop={2}>
											<Typography variant="body1">Langue</Typography>
											<Select
												value={language}
												fullWidth
												onChange={handleLanguageChange}>
												<MenuItem value="fr">Français</MenuItem>
												<MenuItem value="en">Anglais</MenuItem>
											</Select>
										</Box>
									)}
								</FormGroup>
							</CardContent>
						</Card>
					) : null
				)}
			</Box>
		</Container>
	);
};

export default AccessibilityOptions;
