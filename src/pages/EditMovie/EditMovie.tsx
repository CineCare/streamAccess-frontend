import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";

const EditMovie: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const handleSave = () => {
    // Logique de sauvegarde (à implémenter)
    console.log(`Sauvegarder les modifications pour le film avec l'ID : ${id}`);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3 }}>
          Modifier le film
        </Typography>
        <TextField
          label="Titre du film"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Sauvegarder
        </Button>
      </Box>
    </>
  );
};

export default EditMovie;
