import React, { useState } from "react";
import {
  Box, Typography, Button, Card, CardContent, AppBar, Toolbar, IconButton, Divider, Tooltip,
  TextField, MenuItem, FormControl, InputLabel, Select, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPreference, RootState } from "../providers/store";

// Même structure d'options que sur la page d'authentification
const accessibilityOptions = {
  general: [
    { key: "theme", label: "Thème" },
    { key: "simplifiedMode", label: "Mode Accessibilité Simplifié" },
    { key: "audioGuide", label: "Guide Audio Simplifié" },
    { key: "softMode", label: "Mode Sensations Douces" },
    { key: "language", label: "Langue" },
  ],
  auditory: [
    { key: "subtitles", label: "Sous-titres Activables" },
    { key: "dialogAmplification", label: "Amplification des Dialogues" },
    { key: "hearingAid", label: "Compatibilité avec Appareils Auditifs" },
    { key: "visualAlerts", label: "Notifications Visuelles" },
  ],
  visual: [
    { key: "highContrast", label: "Mode Contraste Élevé" },
    { key: "darkMode", label: "Mode Sombre" },
    { key: "audioDescription", label: "Audio Description (AD)" },
    { key: "fontSize", label: "Taille de la police" },
  ],
  cognitive: [
    { key: "dyslexiaSubtitles", label: "Sous-titres Dyslexie-Friendly" },
    { key: "pauseMode", label: "Mode de Visionnage avec Pauses Automatiques" },
    { key: "distractionFree", label: "Interface Sans Distraction" },
    { key: "contentSummary", label: "Résumé de Contenu Avant Lecture" },
  ],
  psychical: [
    { key: "filterAnxiety", label: "Filtrage des Contenus Anxiogènes" },
    { key: "guidedNavigation", label: "Navigation Guidée" },
    { key: "calmAmbiance", label: "Ambiances Apaisantes" },
  ],
};

const defaultProfile = {
  name: "",
  general: {
    theme: "default",
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
};

const mockProfiles = [
  {
    id: 1,
    name: "Profil Standard",
    general: { ...defaultProfile.general, theme: "default", language: "fr" },
    auditory: { ...defaultProfile.auditory },
    visual: { ...defaultProfile.visual, fontSize: 14 },
    cognitive: { ...defaultProfile.cognitive },
    psychical: { ...defaultProfile.psychical },
  },
  {
    id: 2,
    name: "Profil Contraste Élevé",
    general: { ...defaultProfile.general, theme: "highContrast", language: "fr" },
    auditory: { ...defaultProfile.auditory },
    visual: { ...defaultProfile.visual, highContrast: true, fontSize: 16 },
    cognitive: { ...defaultProfile.cognitive },
    psychical: { ...defaultProfile.psychical },
  },
];

const AccessibilityOptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profiles, setProfiles] = useState(mockProfiles);
  const [newProfile, setNewProfile] = useState({ ...defaultProfile });
  const [showCreate, setShowCreate] = useState(false);

  // Pour affichage dynamique des options
  const [profileOptions, setProfileOptions] = useState<typeof defaultProfile>({ ...defaultProfile });

  // Pour afficher les valeurs actuelles de l'utilisateur
  const preferences = useSelector((state: RootState) => state.accessibility.preferences);

  // Trouve l'index du profil actif (exact match)
  const activeProfileIndex = profiles.findIndex(profile =>
    Object.entries(accessibilityOptions).every(([category, options]) =>
      options.every(({ key }) => {
        type ProfileType = typeof defaultProfile;
        type CategoryKey = Exclude<keyof ProfileType, "name">;
        const cat = category as CategoryKey;
        const k = key as keyof ProfileType[CategoryKey];
        return preferences[cat]?.[k] === (profile as ProfileType)[cat]?.[k];
      })
    )
  );

  // Réorganise les profils pour mettre le profil actif en premier
  let orderedProfiles = [...profiles];
  if (activeProfileIndex > 0) {
    const [activeProfile] = orderedProfiles.splice(activeProfileIndex, 1);
    orderedProfiles = [activeProfile, ...orderedProfiles];
  }

  const handleProfileSelect = (profileId: number) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (profile) {
      Object.entries(profile).forEach(([category, options]) => {
        if (
          typeof options === "object" &&
          options !== null &&
          category !== "name" &&
          category !== "id"
        ) {
          Object.entries(options as Record<string, boolean | string | number>).forEach(([option, value]) => {
            dispatch(setPreference({ category, option, value }));
          });
        }
      });
    }
  };

  const handleCreateProfile = () => {
    setShowCreate(true);
    setNewProfile({ ...defaultProfile });
    setProfileOptions({ ...defaultProfile });
  };

  const handleProfileOptionChange = <K extends keyof typeof defaultProfile, O extends keyof (typeof defaultProfile)[K]>(
    category: K,
    option: O,
    value: (typeof defaultProfile)[K][O]
  ) => {
    setProfileOptions((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] as object),
        [option]: value,
      },
    }));
  };

  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfile.name.trim()) return;
    const nextId = Math.max(...profiles.map((p) => p.id)) + 1;
    setProfiles([
      ...profiles,
      {
        id: nextId,
        name: newProfile.name,
        general: { ...profileOptions.general },
        auditory: { ...profileOptions.auditory },
        visual: { ...profileOptions.visual },
        cognitive: { ...profileOptions.cognitive },
        psychical: { ...profileOptions.psychical },
      },
    ]);
    setShowCreate(false);
    setNewProfile({ ...defaultProfile });
    setProfileOptions({ ...defaultProfile });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      {/* Barre de navigation */}
      <AppBar position="fixed" color="primary" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="Retour">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Options d'Accessibilité
          </Typography>
          {!showCreate && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCreateProfile}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: "bold",
                fontSize: 16,
                ml: 2,
                bgcolor: "background.paper",
                boxShadow: 1,
                '&:hover': { bgcolor: "background.default" }
              }}
            >
              Créer un nouveau profil
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Décalage pour la navbar fixe */}
      <Toolbar />

      {/* Contenu principal */}
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Gestion des Options d'Accessibilité
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sélectionnez ou personnalisez vos options d'accessibilité. Vous pouvez gérer plusieurs profils.
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4, justifyContent: "center" }}>
          {orderedProfiles.map((profile, idx) => {
            // Affiche le bouton "Actif" uniquement sur la card du profil actif (en première position)
            const isActive = idx === 0 && activeProfileIndex !== -1;
            console.log(profile);
            return (
              <Card
                key={profile.id}
                sx={{
                  p: 0,
                  borderRadius: 3,
                  boxShadow: isActive ? 8 : 4,
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 8, borderColor: "primary.main" },
                  border: "2px solid",
                  borderColor: isActive ? "success.main" : "transparent",
                  backgroundColor: "background.paper",
                  maxWidth: 600,
                  minWidth: 400,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  outline: isActive ? "3px solid" : undefined,
                  outlineColor: isActive ? "success.main" : undefined,
                  mb: isActive ? 2 : 0,
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", flexGrow: 1 }}>
                      {profile.name}
                    </Typography>
                    {isActive ? (
                      <Tooltip title="Ce profil est actuellement appliqué" arrow>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled
                          sx={{ borderRadius: 2, minWidth: 0, px: 2 }}
                        >
                          Actif
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Sélectionner ce profil" arrow>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleProfileSelect(profile.id)}
                          sx={{ borderRadius: 2, minWidth: 0, px: 2 }}
                        >
                          Utiliser
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                  <Divider sx={{ mb: 1 }} />
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {Object.entries(accessibilityOptions).map(([category, options]) => (
                      <Box
                        key={category}
                        sx={{
                          flex: "1 1 180px",
                          minWidth: 180,
                          maxWidth: 220,
                          borderRadius: 2,
                          p: 1,
                          mb: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Typography>
                        {options.map(({ key, label }) => {
                          type ProfileType = typeof defaultProfile;
                          type CategoryKey = Exclude<keyof ProfileType, "name">;
                          const cat = category as CategoryKey;
                          const k = key as keyof ProfileType[CategoryKey];
                          const value = (profile as ProfileType)[cat]?.[k];
                          return (
                            <Typography key={key} variant="body2" sx={{ fontSize: 14 }}>
                              <strong>{label.split(" - ")[0]}:</strong>{" "}
                              {typeof value === "boolean"
                                ? value ? "Oui" : "Non"
                                : value}
                            </Typography>
                          );
                        })}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
        {/* Modale de création de profil */}
        <Dialog open={showCreate} onClose={() => setShowCreate(false)} maxWidth="md" fullWidth>
          <DialogTitle>Nouveau profil</DialogTitle>
          <form onSubmit={handleCreateProfileSubmit}>
            <DialogContent>
              <TextField
                label="Nom du profil"
                value={newProfile.name}
                onChange={e => setNewProfile({ ...newProfile, name: e.target.value })}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {Object.entries(accessibilityOptions).map(([category, options]) => (
                  <Box
                    key={category}
                    sx={{
                      flex: "1 1 220px",
                      minWidth: 220,
                      maxWidth: 260,
                      borderRadius: 2,
                      p: 2,
                      mb: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Typography>
                    {options.map(({ key, label }) => {
                      type ProfileType = typeof defaultProfile;
                      type CategoryKey = Exclude<keyof ProfileType, "name">;
                      const cat = category as CategoryKey;
                      const k = key as keyof ProfileType[CategoryKey];
                      const value = (profileOptions[cat] as ProfileType[CategoryKey])[k];

                      if (key === "theme") {
                        return (
                          <FormControl key={key} sx={{ minWidth: 140, mb: 2 }}>
                            <InputLabel>Thème</InputLabel>
                            <Select
                              label="Thème"
                              value={String(value)}
                              onChange={e => handleProfileOptionChange(cat, k, e.target.value as ProfileType[typeof cat][typeof k])}
                            >
                              <MenuItem value="default">Standard</MenuItem>
                              <MenuItem value="highContrast">Contraste Élevé</MenuItem>
                              <MenuItem value="soft">Doux</MenuItem>
                              <MenuItem value="lightTheme">Lumineux</MenuItem>
                              <MenuItem value="largeText">Grand Texte</MenuItem>
                            </Select>
                          </FormControl>
                        );
                      }
                      if (key === "fontSize") {
                        return (
                          <TextField
                            key={key}
                            label={label}
                            type="number"
                            inputProps={{ min: 12, max: 24 }}
                            value={Number(value)}
                            onChange={e => handleProfileOptionChange(cat, k, Number(e.target.value) as ProfileType[typeof cat][typeof k])}
                            sx={{ minWidth: 120, mb: 2 }}
                          />
                        );
                      }
                      if (key === "language") {
                        return (
                          <FormControl key={key} sx={{ minWidth: 120, mb: 2 }}>
                            <InputLabel>Langue</InputLabel>
                            <Select
                              label="Langue"
                              value={String(value)}
                              onChange={e => handleProfileOptionChange(cat, k, e.target.value as ProfileType[typeof cat][typeof k])}
                            >
                              <MenuItem value="fr">Français</MenuItem>
                              <MenuItem value="en">Anglais</MenuItem>
                            </Select>
                          </FormControl>
                        );
                      }
                      // booléens
                      return (
                        <FormControlLabel
                          key={key}
                          control={
                            <Switch
                              checked={!!value}
                              onChange={e => handleProfileOptionChange(cat, k, e.target.checked as ProfileType[typeof cat][typeof k])}
                              color="primary"
                            />
                          }
                          label={label}
                          sx={{ minWidth: 220, mr: 2, mb: 1 }}
                        />
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "flex-end", gap: 2, px: 2, pb: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Enregistrer
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setShowCreate(false)}>
                Annuler
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AccessibilityOptionsPage;
