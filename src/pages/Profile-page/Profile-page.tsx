import React, { useState, useCallback } from "react";
import { Container, Box, Typography, Avatar, Button, Divider, TextField, Alert, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setUserAvatar, setUserInfo } from "../../providers/store";
import Navbar from "../../components/Navbar/Navbar";
import { useAvatar } from "../../hooks/useAvatar";
import { updateUserProfile } from "../../services/FetcherService";

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { avatar } = useAvatar();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [editPseudo, setEditPseudo] = useState(user.name);
  const [actualPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset form fields
  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Gère la sélection de fichier
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }, []);

  // Envoi global du profil (pseudo, avatar, mot de passe)
  const handleProfileUpdate = async () => {
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg("Les nouveaux mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const data = await updateUserProfile({
        pseudo: editPseudo,
        avatar: selectedFile,
        actualPassword: actualPassword || undefined,
        newPassword: newPassword || undefined,
        newPasswordConfirm: confirmPassword || undefined,
      });
      dispatch(setUserInfo({ name: data.pseudo, email: data.email, avatar: data.avatar }));
      dispatch(setUserAvatar(data.avatar));
      setSuccessMsg("Profil mis à jour avec succès !");
      resetForm();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erreur lors de la modification du profil.");
      setErrorMsg(error.message || "Erreur lors de la modification du profil.");
    } finally {
      setLoading(false);
    }
  };

  // Génère les champs de mot de passe
  const passwordFields = [
    {
      label: "Mot de passe actuel",
      value: actualPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value),
      autoComplete: "current-password",
    },
    {
      label: "Nouveau mot de passe",
      value: newPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value),
      autoComplete: "new-password",
    },
    {
      label: "Confirmer le nouveau mot de passe",
      value: confirmPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value),
      autoComplete: "new-password",
    },
  ];

  // Génère le champ d'upload d'avatar
  const renderAvatarUpload = () => (
    <Box>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        Modifier l'avatar
      </Typography>
      <Button variant="outlined" component="label" fullWidth sx={{ marginBottom: 2 }}>
        Choisir une image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {selectedFile && (
        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          {selectedFile.name}
        </Typography>
      )}
    </Box>
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
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
          {/* Haut : Avatar, pseudo, mail */}
          <Avatar
            src={previewUrl ? previewUrl : avatar}
            alt={user.name}
            sx={{ width: 100, height: 100, marginBottom: 2 }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 2 }}>
            {user.email}
          </Typography>

          <Divider sx={{ width: "100%", marginBottom: 3 }} />

          {/* 2 colonnes : gauche = pseudo/avatar, droite = mot de passe */}
          <Grid container spacing={3} sx={{ width: "100%", marginBottom: 3 }}>
            {/* Colonne gauche */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ marginBottom: 3 }}>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  Modifier le pseudo
                </Typography>
                <TextField
                  fullWidth
                  value={editPseudo}
                  onChange={e => setEditPseudo(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  label="Nouveau pseudo"
                />
              </Box>
              {renderAvatarUpload()}
            </Grid>
            {/* Colonne droite */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  Modifier le mot de passe
                </Typography>
                {passwordFields.map((field) => (
                  <TextField
                    key={field.label}
                    fullWidth
                    label={field.label}
                    type="password"
                    value={field.value}
                    onChange={field.onChange}
                    sx={{ marginBottom: 2 }}
                    autoComplete={field.autoComplete}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          {successMsg && <Alert severity="success" sx={{ mb: 2, width: "100%" }}>{successMsg}</Alert>}
          {errorMsg && <Alert severity="error" sx={{ mb: 2, width: "100%" }}>{errorMsg}</Alert>}

          <Divider sx={{ width: "100%", marginBottom: 3 }} />

          {/* Boutons centrés */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ minWidth: 180 }}
              onClick={handleProfileUpdate}
              disabled={loading}
            >
              {loading ? "Modification..." : "Modifier le profil"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ minWidth: 180 }}
              onClick={() => console.log("Supprimer le compte")}
            >
              Supprimer le compte
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ProfilePage;
