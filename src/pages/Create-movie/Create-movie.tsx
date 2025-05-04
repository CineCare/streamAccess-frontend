import React, { useState } from "react";
import { TextField, Button, Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createMovie } from "../../services/FetcherService";

const CreateMovie: React.FC = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ title: "", description: "", releaseDate: "" });
	const [errors, setErrors] = useState<{ title?: string; description?: string; releaseDate?: string }>({});
	const [loading, setLoading] = useState(false);
	const [serverMessage, setServerMessage] = useState<string | null>(null);

	const validateForm = () => {
		let valid = true;
		const newErrors: { title?: string; description?: string; releaseDate?: string } = {};

		if (!formData.title) {
			newErrors.title = "Le titre est requis.";
			valid = false;
		}

		if (!formData.description) {
			newErrors.description = "La description est requise.";
			valid = false;
		}

		if (!formData.releaseDate) {
			newErrors.releaseDate = "La date de sortie est requise.";
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setServerMessage(null);

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			await createMovie(formData);
			setServerMessage("Film créé avec succès !");
			navigate("/movies");
		} catch (error) {
			if (error instanceof Error) {
				setServerMessage(error.message);
			} else {
				setServerMessage("Une erreur inconnue s'est produite.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card sx={{ mb: 3, "&:hover": { boxShadow: 3 } }}>
			<CardContent>
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginTop: 4 }}>
					<TextField
						label="Titre"
						type="text"
						fullWidth
						value={formData.title}
						onChange={e => setFormData({ ...formData, title: e.target.value })}
						error={!!errors.title}
						helperText={errors.title}
						required
					/>
					<TextField
						label="Description"
						type="text"
						fullWidth
						value={formData.description}
						onChange={e => setFormData({ ...formData, description: e.target.value })}
						error={!!errors.description}
						helperText={errors.description}
						required
					/>
					<TextField
						label="Date de sortie"
						type="date"
						fullWidth
						value={formData.releaseDate}
						onChange={e => setFormData({ ...formData, releaseDate: e.target.value })}
						error={!!errors.releaseDate}
						helperText={errors.releaseDate}
						required
						InputLabelProps={{ shrink: true }}
					/>
					{serverMessage && (
						<Typography
							variant="body2"
							color={serverMessage.includes("succès") ? "success.main" : "error"}>
							{serverMessage}
						</Typography>
					)}
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={loading}
						sx={{ marginTop: 2 }}>
						{loading ? <CircularProgress size={24} color="inherit" /> : "Créer le film"}
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
};

export default CreateMovie;