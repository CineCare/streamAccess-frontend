import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Button,
  Slider,
  Card,
  CardContent,
} from "@mui/material";

const AccessibilityOptions: React.FC = () => {
  const [accessibilityTab, setAccessibilityTab] = useState(0);
  const [fontSize, setFontSize] = useState(14); // Taille de police personnalisable
  const [language, setLanguage] = useState(""); // Langue sélectionnée

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setAccessibilityTab(newValue);
  };

  const handleFontSizeChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setFontSize(newValue); // Pour un slider simple
    } else {
      console.error("Slider returned a range, but only a single value is supported.");
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Onglets */}
      <Tabs
        value={accessibilityTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Général" />
        <Tab label="Paramètres Sensoriels - Auditif" />
        <Tab label="Paramètres Sensoriels - Visuel" />
        <Tab label="Paramètres Cognitifs" />
        <Tab label="Paramètres Psychiques" />
      </Tabs>

      <Box marginTop={2}>
        {/* Contenu des onglets */}
        {accessibilityTab === 0 && (
          <Card sx={{ mb: 3, "&:hover": { boxShadow: 3 } }}>
            <CardContent>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Mode Accessibilité Simplifié - Active des options adaptées pour un usage facilité."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Guide Audio Simplifié - Fournit des instructions vocales pour la navigation."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Mode Sensations Douces - Réduit les animations et ajuste les couleurs pour un effet apaisant."
                />
                <Box marginBottom={2}>
                  <Typography variant="body1">Choix de Langue</Typography>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="en">Anglais</MenuItem>
                    <MenuItem value="es">Espagnol</MenuItem>
                  </Select>
                </Box>
              </FormGroup>
            </CardContent>
          </Card>
        )}

        {/* Tab Auditif */}
        {accessibilityTab === 1 && (
          <Card sx={{ mb: 3, "&:hover": { boxShadow: 3 } }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Paramètres Sensoriels - Auditif
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Sous-titres Activables - Permet d'afficher des sous-titres pour les dialogues et les sons."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Amplification des Dialogues - Renforce les voix dans les contenus audio."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Compatibilité avec Appareils Auditifs - Ajuste le son pour les appareils compatibles."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Notifications Visuelles - Remplace les alertes sonores par des signaux visuels."
                />
              </FormGroup>
            </CardContent>
          </Card>
        )}

        {/* Tab Visuel */}
        {accessibilityTab === 2 && (
          <Card sx={{ mb: 3, "&:hover": { boxShadow: 3 } }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Paramètres Sensoriels - Visuel
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Mode Contraste Élevé - Améliore la visibilité des textes et des éléments."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Mode Sombre - Réduit la luminosité de l'interface."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Audio Description (AD) - Active les descriptions vocales pour les éléments visuels."
                />
                <Box marginBottom={2}>
                  <Typography variant="body1">
                    Personnalisation de la Taille de la Police
                  </Typography>
                  <Slider
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    min={12}
                    max={24}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </FormGroup>
            </CardContent>
          </Card>
        )}

        {/* Tab Cognitif */}
        {accessibilityTab === 3 && (
          <Card sx={{ mb: 3, "&:hover": { boxShadow: 3 } }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Paramètres Cognitifs
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Sous-titres Dyslexie-Friendly - Utilise des polices adaptées aux personnes dyslexiques."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Mode de Visionnage avec Pauses Automatiques - Ajoute des pauses dans les contenus pour permettre une meilleure assimilation."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Interface Sans Distraction - Affiche uniquement les éléments essentiels."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Résumé de Contenu Avant Lecture - Fournit un résumé rapide des contenus avant le visionnage."
                />
              </FormGroup>
            </CardContent>
          </Card>
        )}

        {/* Tab Psychique */}
        {accessibilityTab === 4 && (
          <Card sx={{ mb: 3, "&:hover": { boxShadow: 3 } }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Paramètres Psychiques
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Filtrage des Contenus Anxiogènes - Masque ou avertit pour les contenus potentiellement stressants."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Navigation Guidée - Simplifie la navigation avec des indications étape par étape."
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Ambiances Apaisantes - Ajuste les effets sonores et visuels pour réduire le stress."
                />
              </FormGroup>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Boutons */}
      <Box marginTop={4} display="flex" justifyContent="space-between">
        <Button variant="outlined" color="secondary">
          Tester mes paramètres
        </Button>
        <Button variant="contained" color="primary">
          Sauvegarder mes préférences
        </Button>
      </Box>
    </Container>
  );
};

export default AccessibilityOptions;
