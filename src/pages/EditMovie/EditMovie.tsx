import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Grid } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import { fetchMovieById, updateMovie, fetchProducers, fetchDirectors, fetchTags, updateMovieTags, fetchMovieTags } from "../../services/FetcherService";
import { Movie } from "../../types/interfaces";

const EditMovie: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [formData, setFormData] = useState({
		title: "",
		releaseYear: "",
		image: null as File | null,
		producerId: "",
		directorId: "",
		shortSynopsis: "",
		longSynopsis: "",
		teamComment: "",
	});
	const [producers, setProducers] = useState<{ id: number; name: string }[]>([]);
	const [directors, setDirectors] = useState<{ id: number; name: string }[]>([]);
	const [tags, setTags] = useState<{ id: number; label: string }[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [movie, setMovie] = useState<Movie | null>(null); // Remplacement de any par Movie | null

	// Récupère les données du film, les listes des producteurs/réalisateurs et les tags
	useEffect(() => {
		const fetchData = async () => {
			if (!id) return;
			try {
				const [movie, producersList, directorsList, tagsList, movieTags] = await Promise.all([
					fetchMovieById(Number(id)),
					fetchProducers(),
					fetchDirectors(),
					fetchTags(),
					fetchMovieTags(Number(id)), // Récupère les tags associés au film
				]);

				setFormData({
					title: movie.title || "",
					releaseYear: movie.releaseYear?.toString() || "",
					image: null,
					producerId: movie.producerId?.toString() || "",
					directorId: movie.directorId?.toString() || "",
					shortSynopsis: movie.shortSynopsis || "",
					longSynopsis: movie.longSynopsis || "",
					teamComment: movie.teamComment || "",
				});
				setProducers(producersList);
				setDirectors(directorsList);
				setTags(tagsList);
				setSelectedTags(movieTags.map(tag => tag.label)); // Stocke les labels des tags associés
				setMovie(movie); // Stocke les données du film dans l'état
			} catch {
				setError("Erreur lors du chargement des données.");
			} finally {
				setFetching(false);
			}
		};
		fetchData();
	}, [id]);

	// Gestion des changements pour les champs texte
	const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	// Gestion des changements pour les sélections
	const handleSelectChange = (e: SelectChangeEvent<string>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name!]: value,
		}));
	};

	// Gestion des changements pour le fichier image
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setFormData(prev => ({
			...prev,
			image: file,
		}));
	};

	// Libération de l'URL après utilisation
	useEffect(() => {
		let objectUrl: string | undefined;
		if (formData.image) {
			objectUrl = URL.createObjectURL(formData.image);
		}

		return () => {
			if (objectUrl) {
				URL.revokeObjectURL(objectUrl);
			}
		};
	}, [formData.image]);

	// Gestion des changements pour les tags sélectionnés
	const handleTagChange = (e: SelectChangeEvent<string[]>) => {
		const value = e.target.value as string[];
		setSelectedTags(value); // Conversion explicite des chaînes en nombres
	};

	// Enregistrement des modifications, y compris les tags
	const handleSave = async () => {
		if (!id) return;
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			await updateMovie(Number(id), formData);

			// Mise à jour des tags uniquement si des tags sont sélectionnés
			if (selectedTags.length > 0) {
				await updateMovieTags(Number(id), selectedTags.map(tag => tags.find(t => t.label === tag)?.id || 0));
			}

			setSuccess(true);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Une erreur inconnue est survenue.");
			}
		} finally {
			setLoading(false);
		}
	};

	if (fetching) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<>
			<Navbar />
			<Box
				sx={{
					padding: 4,
					maxWidth: 1200,
					margin: "0 auto",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between", 
					height: "90vh", // Hauteur fixe pour éviter le scroll
				}}>
				<Box sx={{ flexGrow: 1 }}>
					<Grid
						container
						spacing={4}>
						{/* Section Informations générales */}
						<Grid size={{ xs: 12, md: 6 }}>
							<Typography
								variant="h6"
								sx={{ fontWeight: "bold", marginBottom: 2 }}>
								Informations générales
							</Typography>
							<TextField
								label="Titre du film"
								name="title"
								variant="outlined"
								fullWidth
								value={formData.title}
								onChange={handleTextFieldChange}
								sx={{ marginBottom: 3 }}
							/>
							<TextField
								label="Année de sortie"
								name="releaseYear"
								variant="outlined"
								fullWidth
								value={formData.releaseYear}
								onChange={handleTextFieldChange}
								type="number"
								sx={{ marginBottom: 3 }}
							/>
							<Typography
								variant="body1"
								sx={{ marginBottom: 1 }}>
								Image actuelle :
							</Typography>
							{formData.image ? (
								<Box
									component="img"
									src={URL.createObjectURL(formData.image)}
									alt="Aperçu de la nouvelle image"
									sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 2, marginBottom: 2 }}
								/>
							) : (
								<Box
									component="img"
									src={movie?.image ? `https://streamaccess-dev-backend.codevert.org/assets/movies_images/${movie.image}` : "/images/camera.png"}
									alt="Image actuelle"
									sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 2, marginBottom: 2 }}
								/>
							)}

						</Grid>

						{/* Section Producteur et Réalisateur */}
						<Grid size={{ xs: 12, md: 6 }}>
							<Typography
								variant="h6"
								sx={{ fontWeight: "bold", marginBottom: 2 }}>
								Équipe de production
							</Typography>
							<FormControl
								fullWidth
								sx={{ marginBottom: 3 }}>
								<InputLabel>Producteur</InputLabel>
								<Select
									name="producerId"
									value={formData.producerId}
									onChange={handleSelectChange}>
									{producers.map(producer => (
										<MenuItem
											key={producer.id}
											value={producer.id}>
											{producer.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<FormControl
								fullWidth
								sx={{ marginBottom: 3 }}>
								<InputLabel>Réalisateur</InputLabel>
								<Select
									name="directorId"
									value={formData.directorId}
									onChange={handleSelectChange}>
									{directors.map(director => (
										<MenuItem
											key={director.id}
											value={director.id}>
											{director.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Typography
								variant="body1"
								sx={{ marginBottom: 1 }}>
								Charger une nouvelle image :
							</Typography>
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								<input
									type="file"
									name="image"
									accept="image/*"
									onChange={handleFileChange}
									style={{ flex: 1 }}
								/>
							</Box>
						</Grid>

						{/* Section Synopsis */}
						<Grid size={{ xs: 12, md: 6 }}>
							<Typography
								variant="h6"
								sx={{ fontWeight: "bold", marginBottom: 2 }}>
								Synopsis
							</Typography>
							<TextField
								label="Synopsis Court"
								name="shortSynopsis"
								variant="outlined"
								fullWidth
								value={formData.shortSynopsis}
								onChange={handleTextFieldChange}
								multiline
								rows={2}
								sx={{ marginBottom: 3 }}
							/>
							<TextField
								label="Synopsis Long"
								name="longSynopsis"
								variant="outlined"
								fullWidth
								value={formData.longSynopsis}
								onChange={handleTextFieldChange}
								multiline
								rows={4}
								sx={{ marginBottom: 3 }}
							/>
						</Grid>

						{/* Section Tags */}
						<Grid size={{ xs: 12, md: 6 }}>
							<Typography
								variant="h6"
								sx={{ fontWeight: "bold", marginBottom: 2 }}>
								Tags
							</Typography>
							<FormControl
								fullWidth
								sx={{ marginBottom: 3 }}>
								<InputLabel>Tags</InputLabel>
								<Select
									multiple
									name="tags"
									value={selectedTags} // Affiche les labels des tags associés
									onChange={handleTagChange}
									renderValue={selected => selected.join(", ")}>
									{tags.map(tag => (
										<MenuItem
											key={tag.id}
											value={tag.label}>
											{tag.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</Box>

				{/* Bouton de sauvegarde */}
				<Box sx={{ textAlign: "center", marginTop: 4 }}>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSave}
						disabled={loading}
						sx={{ paddingX: 5 }}>
						{loading ? <CircularProgress size={24} /> : "Sauvegarder"}
					</Button>
					{error && (
						<Typography
							variant="body1"
							color="error"
							sx={{ marginBottom: 3, textAlign: "center" }}>
							{error}
						</Typography>
					)}
					{success && (
						<Typography
							variant="body1"
							color="success.main"
							sx={{ marginBottom: 3, textAlign: "center" }}>
							Le film a été mis à jour avec succès !
						</Typography>
					)}
				</Box>
			</Box>
		</>
	);
};

export default EditMovie;
