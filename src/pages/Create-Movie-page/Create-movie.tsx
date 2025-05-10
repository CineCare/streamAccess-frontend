import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Grid } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import { createMovieWithImage, fetchProducers, fetchDirectors, fetchTags, updateMovieTags } from "../../services/FetcherService";

const CreateMovie: React.FC = () => {
	const [formData, setFormData] = useState({
		title: "",
		releaseYear: "",
		image: null as File | null, // Correction du type
		producerId: "",
		directorId: "",
		shortSynopsis: "",
		longSynopsis: "",
		teamComment: "",
		history: "",
	});

	const [producers, setProducers] = useState<{ id: number; name: string }[]>([]);
	const [directors, setDirectors] = useState<{ id: number; name: string }[]>([]);
	const [tags, setTags] = useState<{ id: number; label: string }[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]); // Stocke les labels des tags sélectionnés
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	// Récupère les listes des producteurs, réalisateurs et tags
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [producersList, directorsList, tagsList] = await Promise.all([
					fetchProducers(),
					fetchDirectors(),
					fetchTags(), // Récupère les tags disponibles
				]);
				setProducers(producersList);
				setDirectors(directorsList);
				setTags(tagsList);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("Erreur lors du chargement des données.");
				}
			}
		};
		fetchData();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSelectChange = (e: SelectChangeEvent<string>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name!]: value,
		});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setFormData({
			...formData,
			image: file,
		});
	};

	const handleTagChange = (e: SelectChangeEvent<string[]>) => {
		const value = e.target.value as string[];
		setSelectedTags(value); // Stocke les labels des tags sélectionnés
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		try {
				// Création du film
				const createdMovie = await createMovieWithImage(formData);
				// Mise à jour des tags après la création du film
				if (selectedTags.length > 0) {
					const tagIds = selectedTags.map(tag => tags.find(t => t.label === tag)?.id || 0); // Convertit les labels en IDs
					console.log(createdMovie.id, tagIds); // Vérification des IDs
					await updateMovieTags(createdMovie.id, tagIds); // Utilise l'ID du film créé pour associer les tags
				}

			// Réinitialisation des champs du formulaire
			setFormData({
				title: "",
				releaseYear: "",
				image: null,
				producerId: "",
				directorId: "",
				shortSynopsis: "",
				longSynopsis: "",
				teamComment: "",
				history: "",
			});
			setSelectedTags([]);
			setSuccess(true);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError("An unknown error occurred");
			}
		}
	};

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
						height: "90vh",
					}}>
					<Box sx={{ flexGrow: 1 }}>
						<form onSubmit={handleSubmit}>
							<Grid container spacing={4}>
								{/* Section Informations générales */}
									<Grid size={{ xs: 12, md: 6 }}>
										<Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
											Informations générales
										</Typography>
										<TextField
											label="Titre"
											name="title"
											variant="outlined"
											fullWidth
											value={formData.title}
											onChange={handleChange}
											required
											sx={{ marginBottom: 3 }}
										/>
										<TextField
											label="Année de sortie"
											name="releaseYear"
											variant="outlined"
											fullWidth
											value={formData.releaseYear}
											onChange={handleChange}
											type="number"
											required
											sx={{ marginBottom: 3 }}
										/>
										<Typography variant="body1" sx={{ marginBottom: 1 }}>
											Uploader une image :
										</Typography>
										<input type="file" name="image" accept="image/*" onChange={handleFileChange} />
										{formData.image && (
											<Box
												component="img"
												src={URL.createObjectURL(formData.image)}
												alt="Aperçu de l'image"
												sx={{
													width: 100,
													height: 100,
													objectFit: "cover",
													borderRadius: 2,
													marginTop: 2,
												}}
											/>
										)}
									</Grid>

								{/* Section Producteur et Réalisateur */}
									<Grid size={{ xs: 12, md: 6 }}>
										<Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
											Équipe de production
										</Typography>
										<FormControl fullWidth sx={{ marginBottom: 3 }}>
											<InputLabel>Producteur</InputLabel>
											<Select
												name="producerId"
												value={formData.producerId}
												onChange={handleSelectChange}>
												{producers.map(producer => (
													<MenuItem key={producer.id} value={producer.id.toString()}>
														{producer.name}
													</MenuItem>
												))}
											</Select>
										</FormControl>
										<FormControl fullWidth sx={{ marginBottom: 3 }}>
											<InputLabel>Réalisateur</InputLabel>
											<Select
												name="directorId"
												value={formData.directorId}
												onChange={handleSelectChange}>
												{directors.map(director => (
													<MenuItem key={director.id} value={director.id.toString()}>
														{director.name}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>

								{/* Section Synopsis */}
									<Grid size={{ xs: 12, md: 6 }}>
										<Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
											Synopsis
										</Typography>
										<TextField
											label="Synopsis Court (500 caractères max)"
											name="shortSynopsis"
											variant="outlined"
											fullWidth
											value={formData.shortSynopsis}
											onChange={handleChange}
											multiline
											rows={2}
											sx={{ marginBottom: 3 }}
										/>
										<TextField
											label="Synopsis Long (2000 caractères max)"
											name="longSynopsis"
											variant="outlined"
											fullWidth
											value={formData.longSynopsis}
											onChange={handleChange}
											multiline
											rows={4}
											sx={{ marginBottom: 3 }}
										/>
									</Grid>

								{/* Section Commentaire de l'équipe */}
									<Grid size={{ xs: 12, md: 6 }}>
										<Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
											Commentaire de l'équipe
										</Typography>
										<TextField
											label="Commentaire de l'équipe"
											name="teamComment"
											variant="outlined"
											fullWidth
											value={formData.teamComment}
											onChange={handleChange}
											multiline
											rows={3}
											sx={{ marginBottom: 3 }}
										/>
									</Grid>

									{/* Section History de l'équipe */}
									<Grid size={{ xs: 12, md: 6 }}>
										<Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
											Histoire ou anecdocte autour de la réalisation du film
										</Typography>
										<TextField
											label="Histoire Anecdote"
											name="history"
											variant="outlined"
											fullWidth
											value={formData.history}
											onChange={handleChange}
											multiline
											rows={3}
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
												value={selectedTags} // Affiche les labels des tags sélectionnés
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

							{/* Bouton d'ajout */}
							<Box sx={{ textAlign: "center", marginTop: 4 }}>
								<Button variant="contained" color="primary" type="submit">
									Ajouter le film
								</Button>
							</Box>
						</form>
					</Box>

					{/* Messages d'erreur ou de succès */}
					{error && (
						<Typography variant="body1" color="error" sx={{ marginBottom: 3, textAlign: "center" }}>
							{error}
						</Typography>
					)}
					{success && (
						<Typography variant="body1" color="success.main" sx={{ marginBottom: 3, textAlign: "center" }}>
							Le film a été ajouté avec succès !
						</Typography>
					)}
				</Box>
		</>
	);
};

export default CreateMovie;
