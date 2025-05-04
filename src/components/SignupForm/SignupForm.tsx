import React, { useState } from "react";
import { TextField, Button, Box, IconButton, InputAdornment, Card, CardContent, Typography, Fab } from "@mui/material";
import { Visibility, VisibilityOff, Mic } from "@mui/icons-material";
import { registerUser } from "../../services/FetcherService";

const SignupForm: React.FC = () => {
	const [formData, setFormData] = useState({
		pseudo: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<Record<string, string>>({});
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		setError(prev => ({ ...prev, [name]: "" })); // Efface les erreurs du champ en cours de modification
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.pseudo.trim()) newErrors.pseudo = "Le pseudo est requis.";
		if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "L'email n'est pas valide.";
		if (formData.password.length < 8) newErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
		if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";

		setError(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSuccessMessage(null);
		if (!validateForm()) return;

		try {
			await registerUser(formData);
			setSuccessMessage("Votre demande a été envoyée avec succès et sera traitée par un administrateur.");
			setFormData({ pseudo: "", email: "", password: "", confirmPassword: "" });
		} catch (error) {
			if (error instanceof Error) {
				setError({ global: error.message });
			} else {
				setError({ global: "Une erreur inconnue est survenue." });
			}
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<Card sx={{ mb: 3, "&:hover": { boxShadow: 3 } }}>
			<CardContent>
			<Fab color="primary" aria-label="add">
				<Mic sx={{ fontSize: 40 }} />
			</Fab>
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginTop: 4 }}>
					<TextField
						label="Pseudo"
						name="pseudo"
						fullWidth
						value={formData.pseudo}
						onChange={handleChange}
						error={!!error.pseudo}
						helperText={error.pseudo}
						required
					/>
					<TextField
						label="Email"
						name="email"
						type="email"
						fullWidth
						value={formData.email}
						onChange={handleChange}
						error={!!error.email}
						helperText={error.email}
						required
					/>
					<TextField
						label="Mot de passe"
						name="password"
						type={showPassword ? "text" : "password"}
						fullWidth
						value={formData.password}
						onChange={handleChange}
						error={!!error.password}
						helperText={error.password}
						required
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={togglePasswordVisibility}
										edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<TextField
						label="Confirmer le mot de passe"
						name="confirmPassword"
						type="password"
						fullWidth
						value={formData.confirmPassword}
						onChange={handleChange}
						error={!!error.confirmPassword}
						helperText={error.confirmPassword}
						required
					/>

					{error.global && (
						<Typography
							variant="body2"
							color="error"
							sx={{ textAlign: "center" }}>
							{error.global}
						</Typography>
					)}
					{successMessage && (
						<Typography
							variant="body2"
							color="success.main"
							sx={{ textAlign: "center" }}>
							{successMessage}
						</Typography>
					)}

					<Button
						type="submit"
						variant="contained"
						color="primary"
						sx={{ marginTop: 2 }}>
						S'inscrire
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
};

export default SignupForm;
