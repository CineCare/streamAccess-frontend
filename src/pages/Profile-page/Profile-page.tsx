import React, { useState } from "react";
import { Container, Box, Typography, Avatar, Button, Divider, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setUserAvatar } from "../../providers/store"; // Import des actions Redux
import Navbar from "../../components/Navbar/Navbar";

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user); // Récupération des données utilisateur depuis Redux

  const [newAvatar, setNewAvatar] = useState("");

  const handleAvatarChange = () => {
    if (newAvatar.trim()) {
      dispatch(setUserAvatar(newAvatar)); // Mise à jour de l'avatar dans Redux
      setNewAvatar("");
    }
  };

  return (
    <>
      <Navbar /> {/* Ajout de la navbar */}
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {/* Avatar et nom */}
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{ width: 100, height: 100, marginBottom: 2 }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 3 }}>
            {user.email}
          </Typography>

          <Divider sx={{ width: "100%", marginBottom: 3 }} />

          {/* Modification de l'avatar */}
          <Box sx={{ width: "100%", marginBottom: 3 }}>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              Modifier l'avatar
            </Typography>
            <TextField
              fullWidth
              placeholder="URL de l'avatar"
              value={newAvatar}
              onChange={(e) => setNewAvatar(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAvatarChange}
            >
              Mettre à jour l'avatar
            </Button>
          </Box>

          <Divider sx={{ width: "100%", marginBottom: 3 }} />

          {/* Actions */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginBottom: 2 }}
            onClick={() => console.log("Modifier le profil")} // TODO: Implémenter la logique de modification
          >
            Modifier le profil
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => console.log("Supprimer le compte")} // TODO: Implémenter la logique de suppression
          >
            Supprimer le compte
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ProfilePage;
