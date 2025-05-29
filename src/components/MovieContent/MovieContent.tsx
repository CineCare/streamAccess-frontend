import { Card, Box, Typography, CardMedia, Chip, Button, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Movie } from "../../types/interfaces";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3100"; // Utilisation de la variable d'environnement

interface MovieContentProps {
	movie: Movie;
	producerName: string;
	directorName: string;
	tags: { id: number; label: string }[]; // Ajout des tags associés
}

const MovieContent: React.FC<MovieContentProps> = ({ movie, producerName, directorName, tags }) => {
	const theme = useTheme();

	return (
		<Card sx={{ width: "100%", height: "100%", borderRadius: 2, display: "flex", flexDirection: "column" }}>
			<Box sx={{ overflow: "auto", height: "100%" }}>
				{/* Titre centré avec plus d'espace */}
				<Box sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					py: 3,
					px: 2,
					borderBottom: 1,
					borderColor: "divider",
					backgroundColor: theme.palette.primary.main + "20",
				}}>
					<Typography
						variant="h5"
						component="h1"
						align="center"
						sx={{ 
							fontWeight: 'bold',
							color: theme.palette.text.primary
						}}>
						{movie.title}
					</Typography>
				</Box>
				{/* En-tête : Affiche + Infos principales */}
				<Box
					sx={{
						display: "flex",
						gap: 2,
						p: 2,
						borderBottom: 1,
						borderColor: "divider",
					}}>
					{/* Affiche */}
					<CardMedia
						component="img"
						sx={{
							width: 120,
							height: 180,
							objectFit: "contain",
							borderRadius: 1,
							backgroundColor: "black",
						}}
						image={movie.image ? `${backendUrl}/assets/movies_images/${movie.image}` : "/images/camera.png"}
						alt={`Affiche du film ${movie.title}`}
					/>

					{/* Informations principales */}
					<Box sx={{ flex: 1 }}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
							<Typography variant="body1">
								<strong>Année :</strong> {movie.releaseYear}
							</Typography>
							<Typography variant="body1">
								<strong>Producteur :</strong> {producerName}
							</Typography>
							<Typography variant="body1">
								<strong>Réalisateur :</strong> {directorName}
							</Typography>
							{tags.length > 0 && (
								<Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 1 }}>
									{tags.map(tag => (
										<Chip
											key={tag.id}
											label={tag.label}
											size="small"
											sx={{ backgroundColor: theme.palette.primary.main + "20" }}
										/>
									))}
								</Box>
							)}
							<Divider sx={{ my: 1 }} />
							<Typography
								variant="h6"
								gutterBottom>
								Commentaire de l'équipe :
							</Typography>
							<Typography variant="body1" sx={{ marginBottom: 2, fontStyle: "italic", color: "text.secondary", textAlign: "justify" }}>
								{movie.teamComment || "Non disponible"}
							</Typography>
						</Box>
					</Box>
				</Box>

				{/* Synopsis */}
				<Box sx={{ p: 2 }}>
					<Typography
						variant="h6"
						gutterBottom>
						Synopsis
					</Typography>
					<Typography
						variant="body1"
						paragraph
						sx={{
							color: "text.secondary",
							whiteSpace: "pre-wrap", // Permet de conserver les retours à la ligne
							wordWrap: "break-word", // Permet de couper les mots trop longs
							textAlign: "justify",
						}}>
						{movie.longSynopsis || "Aucun synopsis disponible."}
					</Typography>
				</Box>
				{/* Historique */}
			<Box sx={{ p: 2 }}>
					<Typography
						variant="h6"
						gutterBottom>
						Histoire Anecdote
					</Typography>
					<Typography
						variant="body1"
						paragraph
						sx={{
							color: "text.secondary",
							whiteSpace: "pre-wrap", // Permet de conserver les retours à la ligne
							wordWrap: "break-word", // Permet de couper les mots trop longs
							textAlign: "justify",
						}}>
						{movie.history || "Aucune information disponible."}
					</Typography>
				</Box>
			</Box>
	
			{/* Bouton Signaler fixe en bas */}
			<Box
				sx={{
					p: 2,
					borderTop: 1,
					borderColor: "divider",
					backgroundColor: theme.palette.background.paper,
					mt: "auto",
				}}>
				<Button
					variant="contained"
					color="secondary"
					fullWidth
					startIcon={<ReportProblemIcon />}>
					Signaler un problème
				</Button>
			</Box>
		</Card>
	);
};

export default MovieContent;
