import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {Box, CircularProgress, Typography, Card, CardMedia, CardContent} from "@mui/material";

async function fetchMovieById(id: number) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token manquant !");
  }

  const response = await fetch(`https://streamaccess-dev-backend.codevert.org/movies/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error("Erreur : ${response.status} (${response.statusText})");
  }

  return response.json();
}

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: movie, error, isLoading } = useQuery(["movie", id], () => fetchMovieById(parseInt(id ||"0")),
  {
    enabled: !!id,
  }
);

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
    <Card sx={{ maxWidth: 600, margin: "0 auto" }}>
      <CardMedia
        component="img"
        height="400"
        image={`https://streamaccess-dev-backend.codevert.org/assets/movies_images/${movie.image}` || "/images/camera.png"}
        alt={`Affiche du film ${movie.title}`}
        sx={{ objectFit: "contain" }}
      />
      <CardContent>
        <Typography variant="h3" component="h1" gutterBottom>
          {movie.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {movie.description}
        </Typography>
      </CardContent>
    </Card>
  </Box>
);
};

export default MoviePage;
