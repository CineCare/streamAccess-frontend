import { useState, useEffect } from "react";
import { Box, Grid, Typography, Card, CardContent, CardMedia, Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  releaseYear: number;
  image: string;
}

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Récupère le token directement
  
        if (!token) {
          throw new Error("Token manquant !");
        }
  
        const response = await fetch("https://streamaccess-dev-backend.codevert.org/movies", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });
  
        if (!response.ok) {
          throw new Error(`Erreur : ${response.status} (${response.statusText})`);
        }
  
        const data = await response.json();
        setMovies(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h4" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Films
      </Typography>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card sx={{ maxWidth: 345, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={`https://streamaccess-dev-backend.codevert.org/assets/movies_images/${movie.image}` || "/images/camera.png"}
                alt={`Affiche du film ${movie.title}`}
              />
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {movie.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {movie.releaseYear}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                  component={Link}
                  to={`/movie/${movie.id}`}
                  aria-label={`En savoir plus sur ${movie.title}`}
                >
                  Voir le film
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Movies;