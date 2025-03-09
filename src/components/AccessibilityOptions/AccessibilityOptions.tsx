import { useDispatch, useSelector } from "react-redux";
import { Container, Box, Typography, Tabs, Tab, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, Slider, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { RootState, setPreference } from "../../providers/store";

// Configuration centralisée des options (mapping externe)
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

const tabTitles = ["Général", "Paramètres Sensoriels - Auditif", "Paramètres Sensoriels - Visuel", "Paramètres Cognitifs", "Paramètres Psychiques"];

const AccessibilityOptions: React.FC = () => {
	const dispatch = useDispatch();
	const preferences = useSelector((state: RootState) => state.accessibility.preferences);
	const [accessibilityTab, setAccessibilityTab] = useState(0);
	const [fontSize, setFontSize] = useState<number>(typeof preferences.visual?.fontSize === "number" ? preferences.visual.fontSize : 14);
	const [language, setLanguage] = useState<string>(typeof preferences.general?.language === "string" ? preferences.general.language : "fr");

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setAccessibilityTab(newValue);
	};

	const handlePreferenceChange = (category: string, option: string, value: unknown) => {
		dispatch(setPreference({ category, option, value: value as boolean }));
	};

	const handleLanguageChange = (event: SelectChangeEvent<string>) => {
		const newLanguage = event.target.value as string;
		setLanguage(newLanguage); // Mettre à jour la langue localement
		dispatch(setPreference({ category: "general", option: "language", value: newLanguage })); // Et dans le store
	};

	return (
		<Container maxWidth="lg">
			<Tabs
				value={accessibilityTab}
				onChange={handleTabChange}
				textColor="primary"
				indicatorColor="primary"
				variant="scrollable"
				scrollButtons="auto">
				{tabTitles.map((title, index) => (
					<Tab
						label={title}
						key={index}
					/>
				))}
			</Tabs>

			<Box marginTop={2}>
				{Object.entries(accessibilityOptions).map(
					([category, options], index) =>
						accessibilityTab === index && (
							<Card
								key={category}
								sx={{ mb: 3, "&:hover": { boxShadow: 3 } }}>
								<CardContent>
									<Typography
										variant="h5"
										gutterBottom>
										{tabTitles[index]} {/* Affiche le titre de l'onglet correspondant */}
									</Typography>
									<FormGroup>
										{options.map(({ key, label }) => (
											<FormControlLabel
												key={key}
												control={
													<Checkbox
														checked={Boolean(preferences[category]?.[key])} // S'assurer que la valeur est bien un boolean
														onChange={e => handlePreferenceChange(category, key, e.target.checked)}
													/>
												}
												label={label}
											/>
										))}
										{category === "visual" && (
											<Box marginBottom={2}>
												<Typography variant="body1">Taille de la police</Typography>
												<Slider
													value={fontSize}
													onChange={(_e, value) => setFontSize(value as number)}
													onChangeCommitted={(_e, value) => dispatch(setPreference({ category: "visual", option: "fontSize", value: Array.isArray(value) ? value[0] : value }))}
													min={12}
													max={24}
												/>
											</Box>
										)}
										{category === "general" && (
											<Box marginBottom={2}>
												<Typography variant="body1">Langue</Typography>
												<Select
													value={language}
													onChange={handleLanguageChange}>
													<MenuItem value="fr">Français</MenuItem>
													<MenuItem value="en">Anglais</MenuItem>
												</Select>
											</Box>
										)}
									</FormGroup>
								</CardContent>
							</Card>
						)
				)}
			</Box>
		</Container>
	);
};

export default AccessibilityOptions;
