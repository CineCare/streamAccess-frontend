import React, { useState } from "react";
import { TextField, Button, Box, IconButton, InputAdornment, Card, CardContent, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SignupForm: React.FC = () => {
	const [pseudo, setPseudo] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		if (password !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas.");
			return;
		}

		const registrationData = {
			email,
			pseudo,
			password,
		};

		try {
			const response = await fetch("https://streamaccess-dev-backend.codevert.org/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(registrationData),
			});

			if (!response.ok) {
				// Gestion des erreurs (par exemple, email déjà utilisé)
				const errorData = await response.json();
				throw new Error(errorData.message || "Une erreur est survenue lors de l'inscription.");
			}
			const data = await response.json();
			localStorage.setItem('accessToken', data.accessToken);
			alert("Inscription réussie !");
			navigate('/movies');
		} catch (error: any) {
			setError(error.message);
		}
	};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

	return (
		<Card sx={{ mb: 3, "&:hover": { boxShadow: 3 } }}>
			<CardContent>
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginTop: 4 }}>
					{/* Conteneur principal en deux colonnes */}
					<Box sx={{ display: "flex", gap: 4, width: "100%", maxWidth: "80vw" }}>
						{/* Section de gauche - Champs de formulaire */}
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
							<TextField
								label="Pseudo"
								fullWidth
								value={pseudo}
								onChange={e => setPseudo(e.target.value)}
								required
							/>
							<TextField
								label="Email"
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
							/>
							<TextField
								label="Mot de passe"
								type={showPassword ? "text" : "password"}
								fullWidth
								value={password}
								onChange={e => setPassword(e.target.value)}
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
								type="password"
								fullWidth
								value={confirmPassword}
								onChange={e => setConfirmPassword(e.target.value)}
								required
							/>
						</Box>
					</Box>
					{error && (
					<Typography
					variant="body2"
					color="error"
					sx={{ textAlign: "center" }}>
					{error}
					</Typography>
			)}			
					{/* Bouton de validation centré */}
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
