import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Card, CardMedia, CardContent, Modal } from "@mui/material";

async function fetchMovieById(id: number) {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Token manquant !");

  const response = await fetch(`https://streamaccess-dev-backend.codevert.org/movies/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`Erreur : ${response.status} (${response.statusText})`);
  return response.json();
}

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false); // Pour gérer la modal d'image

  const { data: movie, error, isLoading } = useQuery(
    ["movie", id],
    () => fetchMovieById(parseInt(id || "0")),
    { enabled: !!id }
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography variant="h4" color="error">
          {`Erreur : ${(error as Error).message}`}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ maxWidth: 800, margin: "0 auto", borderRadius: 2 }}>
        <CardMedia
          component="img"
          height="400"
          image={`https://streamaccess-dev-backend.codevert.org/assets/movies_images/${movie.image}` || "/images/camera.png"}
          alt={`Affiche du film ${movie.title}`}
          sx={{ objectFit: "contain", cursor: "pointer" }}
          onClick={handleOpen} // Ouvre l'image en plein écran
          />
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom>
            {movie.title} ({movie.releaseYear})
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            <strong>Synopsis :</strong> {movie.longSynopsis || "Aucun synopsis disponible."}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Commentaire de l'équipe :</strong> {movie.teamComment || "Pas de commentaire pour l'instant."}
          </Typography>
        </CardContent>
      </Card>

      {/* Modal pour afficher l'image en plein écran */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Fond semi-transparent
          }}
        >
          <img
            src={`https://streamaccess-dev-backend.codevert.org/assets/movies_images/${movie.image}` || "/images/camera.png"}
            alt={`Affiche du film ${movie.title}`}
            style={{ maxHeight: "90%", maxWidth: "90%", borderRadius: "8px" }}
            onClick={handleClose}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default MoviePage;