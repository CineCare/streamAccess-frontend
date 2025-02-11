import React from "react";
import { useQuery } from "react-query";

import { useParams } from "react-router-dom";

// composant pour afficher un film unique
const MoviePage: React.FC = () => {
  // Récupérer l'ID du film à afficher
  const { id } = useParams<{ id: string }>();
  console.log(id);
  // Récupérer le film correspondant à l'ID
  const { data: movie, error } = useQuery<{ title: string; description: string }, Error>(["movie", id], () =>
    id ? getMovieById(parseInt(id)) : Promise.resolve({ title: "", description: "" })
  );

  // Si la requête est en cours
  if (!movie) {
    return <div>Loading...</div>;
  }

  // Si la requête a échoué
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Si la requête a réussi
  return (
    <div>
      <h1>{movie?.title}</h1>
      <p>{movie?.description}</p>
    </div>
  );
}

export default MoviePage;
// Removed custom useQuery hook
async function getMovieById(id: number): Promise<{ title: string; description: string }> {
  // Simulate an API call to fetch movie data by ID
  const mockMovies = [
    { id: 1, title: "Inception", description: "A mind-bending thriller by Christopher Nolan." },
    { id: 2, title: "The Matrix", description: "A sci-fi classic about the nature of reality." },
    { id: 3, title: "Interstellar", description: "A journey through space and time." },
  ];

  return new Promise((resolve, reject) => {
    const movie = mockMovies.find((movie) => movie.id === id);
    if (movie) {
      resolve(movie);
    } else {
      reject(new Error("Movie not found"));
    }
  });
}

