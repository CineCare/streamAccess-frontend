import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import { fetchMovieById, updateMovie, fetchProducers, fetchDirectors } from "../../services/FetcherService";

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
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	// Récupère les données du film et les listes des producteurs/réalisateurs
	useEffect(() => {
		const fetchData = async () => {
			if (!id) return;
			try {
				const [movie, producersList, directorsList] = await Promise.all([
					fetchMovieById(Number(id)),
					fetchProducers(),
					fetchDirectors(),
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

	// Enregistrement des modifications
	const handleSave = async () => {
		if (!id) return;
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			await updateMovie(Number(id), formData);
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
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<>
			<Navbar />
			<Box sx={{ padding: 3 }}>
				<Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3 }}>
					Modifier le film
				</Typography>
				{error && (
					<Typography variant="body1" color="error" sx={{ marginBottom: 2 }}>
						{error}
					</Typography>
				)}
				{success && (
					<Typography variant="body1" color="success.main" sx={{ marginBottom: 2 }}>
						Le film a été mis à jour avec succès !
					</Typography>
				)}
				<TextField
					label="Titre du film"
					name="title"
					variant="outlined"
					fullWidth
					value={formData.title}
					onChange={handleTextFieldChange}
					sx={{ marginBottom: 2 }}
				/>
				<TextField
					label="Année de sortie"
					name="releaseYear"
					variant="outlined"
					fullWidth
					value={formData.releaseYear}
					onChange={handleTextFieldChange}
					type="number"
					sx={{ marginBottom: 2 }}
				/>
				<Typography variant="body1" sx={{ marginBottom: 1 }}>
					Uploader une nouvelle image :
				</Typography>
				<input type="file" name="image" accept="image/*" onChange={handleFileChange} />
				<FormControl fullWidth sx={{ marginBottom: 2 }}>
					<InputLabel>Producteur</InputLabel>
					<Select
						name="producerId"
						value={formData.producerId}
						onChange={handleSelectChange}
					>
						{producers.map(producer => (
							<MenuItem key={producer.id} value={producer.id}>
								{producer.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl fullWidth sx={{ marginBottom: 2 }}>
					<InputLabel>Réalisateur</InputLabel>
					<Select
						name="directorId"
						value={formData.directorId}
						onChange={handleSelectChange}
					>
						{directors.map(director => (
							<MenuItem key={director.id} value={director.id}>
								{director.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					label="Synopsis Court"
					name="shortSynopsis"
					variant="outlined"
					fullWidth
					value={formData.shortSynopsis}
					onChange={handleTextFieldChange}
					multiline
					rows={2}
					sx={{ marginBottom: 2 }}
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
					sx={{ marginBottom: 2 }}
				/>
				<TextField
					label="Commentaire de l'équipe"
					name="teamComment"
					variant="outlined"
					fullWidth
					value={formData.teamComment}
					onChange={handleTextFieldChange}
					multiline
					rows={3}
					sx={{ marginBottom: 2 }}
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSave}
					disabled={loading}
					sx={{ marginRight: 2 }}
				>
					{loading ? <CircularProgress size={24} /> : "Sauvegarder"}
				</Button>
			</Box>
		</>
	);
};

export default EditMovie;
