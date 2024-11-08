// src/pages/CatalogPage.tsx
import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';

const movies = [
  {
    id: 1,
    title: 'Freaks',
    description: 'Un film qui raconte l’histoire de personnes différentes vivant dans un cirque.',
    // Ajoute d'autres informations nécessaires sur le film
  },
];

const MoviesPage: React.FC = () => {
  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} key={movie.id}>
          <Card>
            <CardContent>
              <Typography variant="h5">{movie.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.description}
              </Typography>
              <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
                Regarder
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MoviesPage;
