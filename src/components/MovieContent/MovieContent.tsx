import { Card, Box, Typography, CardMedia, Chip, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Movie } from "../../types/interfaces";

const MovieContent: React.FC<{ movie: Movie }> = ({ movie }) => {
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
						image={movie.image ? `https://streamaccess-dev-backend.codevert.org/assets/movies_images/${movie.image}` : "/images/camera.png"}
						alt={`Affiche du film ${movie.title}`}
					/>

					{/* Informations principales */}
					<Box sx={{ flex: 1 }}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
							<Typography variant="body1">
								<strong>Année :</strong> {movie.releaseYear}
							</Typography>
							{movie.producerId && (
								<Typography variant="body1">
									<strong>Producteur :</strong> {movie.producerId}
								</Typography>
							)}
							{movie.directorId && (
								<Typography variant="body1">
									<strong>Réalisateur :</strong> {movie.directorId}
								</Typography>
							)}
							{movie.tags && movie.tags.length > 0 && (
								<Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 1 }}>
									{movie.tags.map((tag, index) => (
										<Chip
											key={index}
											label={tag}
											size="small"
											sx={{ backgroundColor: theme.palette.primary.main + "20" }}
										/>
									))}
								</Box>
							)}
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
						sx={{ color: "text.secondary" }}>
						{movie.longSynopsis || "Aucun synopsis disponible."}
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
