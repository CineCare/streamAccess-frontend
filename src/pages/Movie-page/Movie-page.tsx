import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Card, CardContent, CardMedia, Button, TextField } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";

const fetchMovieById = async (id: number) => {
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
};

const MoviePage = () => {
	const { id } = useParams<{ id: string }>();
	const [comment, setComment] = useState("");

	const { data: movie, error, isLoading } = useQuery(["movie", id], () => fetchMovieById(Number(id)), { enabled: !!id });

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ padding: 3, textAlign: "center", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
				<Typography
					variant="h4"
					color="error">{`Erreur : ${(error as Error).message}`}</Typography>
			</Box>
		);
	}

	return (
		<>
						<Navbar />

			<Box sx={{ display: "grid", gridTemplateColumns: "1fr 3fr", gridTemplateRows: "1fr auto", height: "92vh", width: "100%", padding: 3, gap: 2 }}>
				{/* Colonne de gauche - Affiche + Infos du film + Signalement */}
				<Card sx={{ width: "100%", height: "100%", borderRadius: 2, overflow: "auto" }}>
					<CardMedia
						component="img"
						height="300"
						image={movie.image ? `https://streamaccess-dev-backend.codevert.org/assets/movies_images/${movie.image}` : "/images/camera.png"}
						alt={`Affiche du film ${movie.title}`}
						sx={{ objectFit: "contain" }}
					/>
					<CardContent>
						<Typography variant="h4" component="h1" gutterBottom>
							{movie.title} ({movie.releaseYear})
						</Typography>
						<Typography variant="body1" color="text.secondary" paragraph>
							<strong>Synopsis :</strong> {movie.longSynopsis || "Aucun synopsis disponible."}
						</Typography>
						<Button variant="contained" color="secondary" fullWidth>Signaler un problème</Button>
					</CardContent>
				</Card>

				{/* Zone Vidéo */}
				<Box sx={{ width: "100%", height: "100%", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center" }}>
					<Typography color="white">Lecteur Vidéo (à implémenter)</Typography>
				</Box>

				{/* Bande du bas - Commentaires */}
				<Box sx={{ gridColumn: "span 2", width: "100%", paddingTop: 2 }}>
					<Typography variant="h5" gutterBottom>Laisser un commentaire</Typography>
          <Box sx={{ display: "flex" }}>
            <TextField fullWidth multiline rows={2} variant="outlined" placeholder="Écrivez votre commentaire ici..." value={comment} onChange={e => setComment(e.target.value)} />
            <Button variant="contained" color="primary" sx={{ marginTop: 1 }}>Envoyer</Button>
          </Box>
				</Box>
			</Box>
		</>
	);
};

export default MoviePage;