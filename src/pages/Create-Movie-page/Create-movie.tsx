import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Grid } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import { createMovieWithImage, fetchProducers, fetchDirectors, fetchTags, updateMovieTags } from "../../services/FetcherService";
import ShortTextIcon from '@mui/icons-material/ShortText';
import NotesIcon from '@mui/icons-material/Notes';
import ChatIcon from '@mui/icons-material/Chat';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

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
					margin: "0 auto",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					height: "90vh",
				}}>
				<Box sx={{ flexGrow: 1 }}>
					<form onSubmit={handleSubmit}>
						<Grid
							container
							spacing={3}>
							{/* Ligne 1 : Infos générales, Équipe, Tags */}
							<Grid size={{ xs: 12, md: 4 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
									<MovieIcon sx={{ mr: 1 }} />
									<Typography variant="h6" gutterBottom>
										Infos générales <Typography component="span" sx={{ color: "error.main" }}>*</Typography>
									</Typography>
								</Box>
								<TextField
									fullWidth
									label="Titre du film"
									name="title"
									value={formData.title}
									onChange={handleChange}
									sx={{ mb: 2 }}
								/>
								<TextField
									fullWidth
									label="Année de sortie"
									name="releaseYear"
									value={formData.releaseYear}
									onChange={handleChange}
									type="number"
									sx={{ mb: 2 }}
								/>
							</Grid>

							<Grid size={{ xs: 12, md: 4 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
									<TheatersIcon sx={{ mr: 1 }} />
									<Typography variant="h6" gutterBottom>
										Équipe de production
									</Typography>
								</Box>
								<FormControl
									fullWidth
									sx={{ mb: 2 }}>
									<InputLabel>Producteur</InputLabel>
									<Select
										name="producerId"
										value={formData.producerId}
										onChange={handleSelectChange}
										label="Producteur">
										{producers.map(p => (
											<MenuItem
												key={p.id}
												value={p.id.toString()}>
												{p.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<FormControl fullWidth>
									<InputLabel>Réalisateur</InputLabel>
									<Select
										name="directorId"
										value={formData.directorId}
										onChange={handleSelectChange}
										label="Réalisateur">
										{directors.map(d => (
											<MenuItem
												key={d.id}
												value={d.id.toString()}>
												{d.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							<Grid size={{ xs: 12, md: 4 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
									<LocalOfferIcon sx={{ mr: 1 }} />
									<Typography variant="h6" gutterBottom>
										Tags
									</Typography>
								</Box>
								<FormControl fullWidth>
									<InputLabel>Tags</InputLabel>
									<Select
										multiple
										value={selectedTags}
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

							{/* Ligne 2 : Jaquette, Histoire, Commentaire */}
							<Grid size={{ xs: 12, md: 4 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
									<PermMediaIcon sx={{ mr: 1 }} />
									<Typography variant="h6" gutterBottom>
										Jaquette
									</Typography>
								</Box>
								<Box>
									<Box>
								<Button
									variant="outlined"
									component="label"
									sx={{ mb: 1 }}>
									Choisir un fichier
									<input
										type="file"
										hidden
										accept="image/*"
										onChange={handleFileChange}
									/>
								</Button>
								<Typography variant="body2">{formData.image?.name || "Aucun fichier choisi"}</Typography>
									</Box>
								
								{formData.image && (
									<Box
										component="img"
										src={URL.createObjectURL(formData.image)}
										alt="Aperçu"
										sx={{ height: 200, objectFit: "contain", mt: 2, flexGrow:1  }}
									/>
								)}
								</Box>
							</Grid>

							<Grid size={{ xs: 12, md: 4 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
									<InfoOutlineIcon sx={{ mr: 1 }} />
									<Typography variant="h6" gutterBottom>
										Histoire/anecdote
									</Typography>
								</Box>
								<TextField
									fullWidth
									multiline
									rows={6}
									name="history"
									value={formData.history}
									onChange={handleChange}
									variant="outlined"
								/>
							</Grid>

							<Grid size={{ xs: 12, md: 4 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
									<ChatIcon sx={{ mr: 1 }} />
									<Typography variant="h6" gutterBottom>
										Commentaire
									</Typography>
								</Box>
								<TextField
									fullWidth
									multiline
									rows={6}
									name="teamComment"
									value={formData.teamComment}
									onChange={handleChange}
									variant="outlined"
								/>
							</Grid>

							{/* Ligne 3 : Synopsis court / long */}
							<Grid size={{ xs: 12, md: 6 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
									<ShortTextIcon sx={{ mr: 1 }} />
									<Typography variant="h6" gutterBottom>
										Synopsis court
									</Typography>
								</Box>
								<TextField
									fullWidth
									multiline
									rows={6}
									name="shortSynopsis"
									value={formData.shortSynopsis}
									onChange={handleChange}
									variant="outlined"
								/>
							</Grid>

							<Grid size={{ xs: 12, md: 6 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
									<NotesIcon sx={{ mr: 1 }} />
									<Typography variant="h6" gutterBottom>
										Synopsis long
									</Typography>
								</Box>
								<TextField
									fullWidth
									multiline
									rows={6}
									name="longSynopsis"
									value={formData.longSynopsis}
									onChange={handleChange}
									variant="outlined"
								/>
							</Grid>

							{/* Ligne 4 : bouton */}
							<Grid
								size={{ xs: 12 }}
								sx={{ textAlign: "center" }}>
								<Button
									type="submit"
									variant="contained"
									color="success"
									sx={{ px: 6 }}>
									ENREGISTRER
								</Button>
							</Grid>

							{/* Message de retour */}
							<Grid
								size={{ xs: 12 }}
								sx={{ textAlign: "center" }}>
								{success && <Typography color="success.main">Le film a été ajouté avec succès !</Typography>}
								{error && <Typography color="error">{error}</Typography>}
							</Grid>
						</Grid>
					</form>
				</Box>
			</Box>
		</>
	);
};

export default CreateMovie;
