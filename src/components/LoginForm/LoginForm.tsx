import React, { useState } from "react";
import { TextField, Button, Box, IconButton, InputAdornment, Card, CardContent, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm: React.FC = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
	const [showPassword, setShowPassword] = useState(false);
	const [serverMessage, setServerMessage] = useState<string | null>(null);

	const validateForm = () => {
		let valid = true;
		let newErrors: { email?: string; password?: string } = {};

		if (!formData.email) {
			newErrors.email = "L'email est requis.";
			valid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Format d'email invalide.";
			valid = false;
		}

		if (!formData.password) {
			newErrors.password = "Le mot de passe est requis.";
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setServerMessage(null);

		if (!validateForm()) return;

		try {
			const response = await fetch("https://streamaccess-dev-backend.codevert.org/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Erreur lors de la connexion.");
			}

			setServerMessage("Connexion réussie ! Vous allez être redirigé.");
			setTimeout(() => (window.location.href = "/movies"), 2000); // Simule une redirection
		} catch (error: any) {
			setServerMessage(error.message);
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
						label="Email"
						type="email"
						fullWidth
						value={formData.email}
						onChange={e => setFormData({ ...formData, email: e.target.value })}
						error={!!errors.email}
						helperText={errors.email}
						required
					/>
					<TextField
						label="Mot de passe"
						type={showPassword ? "text" : "password"}
						fullWidth
						value={formData.password}
						onChange={e => setFormData({ ...formData, password: e.target.value })}
						error={!!errors.password}
						helperText={errors.password}
						required
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => setShowPassword(!showPassword)}
										edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
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
						sx={{ marginTop: 2 }}>
						Se connecter
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
};

export default LoginForm;
