import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";

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

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		const token = localStorage.getItem("accessToken");
		if (!token) {
			setError("Token manquant !");
			return;
		}

		try {
			const formDataToSend = new FormData();
			formDataToSend.append("title", formData.title);
			formDataToSend.append("releaseYear", formData.releaseYear);
			formDataToSend.append("image", (document.querySelector('input[name="image"]') as HTMLInputElement).files?.[0] || "");
			if (formData.producerId) {
				formDataToSend.append("producerId", formData.producerId);
			}
			if (formData.directorId) {
				formDataToSend.append("directorId", formData.directorId);
			}
			formDataToSend.append("shortSynopsis", formData.shortSynopsis || "");
			formDataToSend.append("longSynopsis", formData.longSynopsis || "");
			formDataToSend.append("teamComment", formData.teamComment || "");

			const response = await fetch("https://streamaccess-dev-backend.codevert.org/movies", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formDataToSend,
			});

			if (!response.ok) {
				throw new Error(`Erreur : ${response.status} (${response.statusText})`);
			}

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
				<Typography
					variant="h4"
					component="h1"
					gutterBottom>
					Ajouter un film
				</Typography>
				{error && (
					<Typography
						variant="body1"
						color="error"
						sx={{ marginBottom: 2 }}>
						{error}
					</Typography>
				)}
				{success && (
					<Typography
						variant="body1"
						color="success.main"
						sx={{ marginBottom: 2 }}>
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

					<Typography
						variant="body1"
						sx={{ marginBottom: 1 }}>
						Uploader une image :
					</Typography>
					<input
						type="file"
						name="image"
						accept="image/*"
					/>

					<TextField
						fullWidth
						label="ID du Producteur"
						name="producerId"
						value={formData.producerId}
						onChange={handleChange}
						type="number"
						sx={{ marginBottom: 2 }}
					/>
					<TextField
						fullWidth
						label="ID du Réalisateur"
						name="directorId"
						value={formData.directorId}
						onChange={handleChange}
						type="number"
						sx={{ marginBottom: 2 }}
					/>
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
					<Button
						variant="contained"
						color="primary"
						type="submit">
						Ajouter le film
					</Button>
				</form>
			</Box>
		</>
	);
};

export default CreateMovie;
