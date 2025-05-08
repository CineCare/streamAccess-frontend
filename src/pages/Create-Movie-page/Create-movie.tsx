import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import { createMovieWithImage, fetchProducers, fetchDirectors } from "../../services/FetcherService";

const CreateMovie: React.FC = () => {
	const [formData, setFormData] = useState({
		title: "",
		releaseYear: "",
		image: "",
		producerId: "",
		directorId: "",
		shortSynopsis: "",
		longSynopsis: "",
		teamComment: "",
	});

	const [producers, setProducers] = useState<{ id: number; name: string }[]>([]);
	const [directors, setDirectors] = useState<{ id: number; name: string }[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	// Récupère les listes des producteurs et réalisateurs
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [producersList, directorsList] = await Promise.all([fetchProducers(), fetchDirectors()]);
				setProducers(producersList);
				setDirectors(directorsList);
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		try {
			await createMovieWithImage(formData);
			setSuccess(true);
			setFormData({
				title: "",
				releaseYear: "",
				image: "",
				producerId: "",
				directorId: "",
				shortSynopsis: "",
				longSynopsis: "",
				teamComment: "",
			});
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
			<Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Ajouter un film
				</Typography>
				{error && (
					<Typography variant="body1" color="error" sx={{ marginBottom: 2 }}>
						{error}
					</Typography>
				)}
				{success && (
					<Typography variant="body1" color="success.main" sx={{ marginBottom: 2 }}>
						Le film a été ajouté avec succès !
					</Typography>
				)}
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Titre"
						name="title"
						value={formData.title}
						onChange={handleChange}
						required
						sx={{ marginBottom: 2 }}
					/>
					<TextField
						fullWidth
						label="Année de sortie"
						name="releaseYear"
						value={formData.releaseYear}
						onChange={handleChange}
						type="number"
						required
						sx={{ marginBottom: 2 }}
					/>

					<Typography variant="body1" sx={{ marginBottom: 1 }}>
						Uploader une image :
					</Typography>
					<input type="file" name="image" accept="image/*" />

					<FormControl fullWidth sx={{ marginBottom: 2 }}>
						<InputLabel>Producteur</InputLabel>
						<Select
							name="producerId"
							value={formData.producerId}
							onChange={handleSelectChange}
						>
							{producers.map(producer => (
								<MenuItem key={producer.id} value={producer.id.toString()}>
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
								<MenuItem key={director.id} value={director.id.toString()}>
									{director.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						fullWidth
						label="Synopsis Court (500 caractères max)"
						name="shortSynopsis"
						value={formData.shortSynopsis}
						onChange={handleChange}
						multiline
						rows={2}
						sx={{ marginBottom: 2 }}
					/>
					<TextField
						fullWidth
						label="Synopsis Long (2000 caractères max)"
						name="longSynopsis"
						value={formData.longSynopsis}
						onChange={handleChange}
						multiline
						rows={4}
						sx={{ marginBottom: 2 }}
					/>
					<TextField
						fullWidth
						label="Commentaire de l'équipe"
						name="teamComment"
						value={formData.teamComment}
						onChange={handleChange}
						multiline
						rows={3}
						sx={{ marginBottom: 2 }}
					/>
					<Button variant="contained" color="primary" type="submit">
						Ajouter le film
					</Button>
				</form>
			</Box>
		</>
	);
};

export default CreateMovie;
