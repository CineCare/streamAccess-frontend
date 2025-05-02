import React, { useState } from "react";
import { Box, Typography, Button, Card, CardContent, AppBar, Toolbar, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const mockProfiles = [
  { id: 1, name: "Profil Standard", settings: { theme: "default", fontSize: 14 } },
  { id: 2, name: "Profil Contraste Élevé", settings: { theme: "highContrast", fontSize: 16 } },
];

const AccessibilityOptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [profiles] = useState(mockProfiles);

  const handleProfileSelect = (profileId: number) => {
    console.log(`Profil sélectionné : ${profileId}`);
    // Logique pour appliquer les paramètres du profil
  };

  const handleCreateProfile = () => {
    console.log("Création d'un nouveau profil");
    // Logique pour créer un nouveau profil
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      {/* Barre de navigation */}
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="Retour">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Options d'Accessibilité
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Gestion des Options d'Accessibilité
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sélectionnez ou personnalisez vos options d'accessibilité. Vous pouvez gérer plusieurs profils.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
          {profiles.map((profile) => (
            <Card key={profile.id} sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {profile.name}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  <strong>Thème :</strong> {profile.settings.theme}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  <strong>Taille de police :</strong> {profile.settings.fontSize}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                  onClick={() => handleProfileSelect(profile.id)}
                >
                  Sélectionner ce profil
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button variant="outlined" color="secondary" onClick={handleCreateProfile} sx={{ alignSelf: "flex-start" }}>
            Créer un nouveau profil
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AccessibilityOptionsPage;
