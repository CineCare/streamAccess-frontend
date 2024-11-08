// src/components/SignupForm.tsx
import React, { useState } from "react";
import { TextField, Button, Box, Typography, FormControl, FormControlLabel, Checkbox, FormGroup, Paper, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

type OptionCategories = "auditif" | "visuel" | "kinesthésique" | "cognitif";

const options: Record<OptionCategories, string[]> = {
	auditif: ["Audiodescription", "Sous-titres"],
	visuel: ["Contraste élevé", "Couleurs personnalisées"],
	kinesthésique: ["Contrôle de la vitesse de lecture"],
	cognitif: ["Résumé de contenu", "Explication simplifiée"],
};

const SignupForm: React.FC = () => {
	const [pseudo, setPseudo] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

	const handleOptionChange = (option: string) => {
		setSelectedOptions(prev => (prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		const registrationData = {
			email,
			pseudo,
			password,
		};
	
		try {
			const response = await fetch('https://streamaccess-dev-backend.codevert.org/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(registrationData),
			});
	
			if (!response.ok) {
				// Gestion des erreurs (par exemple, email déjà utilisé)
				const errorData = await response.json();
				console.error("Erreur lors de l'inscription:", errorData);
				alert(`Erreur : ${errorData.message || 'Une erreur est survenue lors de l\'inscription.'}`);
			} else {
				// Succès de l'inscription
				const data = await response.json();
				console.log("Inscription réussie:", data);
				alert("Inscription réussie !");
				// Redirection ou autre action post-inscription si nécessaire
			}
		} catch (error) {
			console.error("Erreur de réseau:", error);
			alert("Une erreur de réseau est survenue. Veuillez réessayer.");
		}
	};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

	return (
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
						type={showPassword ? 'text' : 'password'}
						fullWidth
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
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

				{/* Section de droite - Encadré avec les options d'accessibilité */}
				<Paper
					elevation={3}
					sx={{
						flex: 1,
						padding: 3,
						backgroundColor: "#f9f9f9",
						border: "1px solid #ddd",
						boxSizing: "border-box",
					}}>
					{/* <Typography variant="h6">Options d'accessibilité</Typography> */}
					<FormControl
						component="fieldset">
						<FormGroup>
							{Object.keys(options).map(category => (
								<Box
									key={category}
									sx={{ marginBottom: 1 }}>
									<Typography
										variant="subtitle1"
										sx={{ textTransform: "capitalize" }}>
										{category}
									</Typography>
									{options[category as OptionCategories].map(option => (
										<FormControlLabel
											key={option}
											control={
												<Checkbox
													checked={selectedOptions.includes(option)}
													onChange={() => handleOptionChange(option)}
												/>
											}
											label={option}
										/>
									))}
								</Box>
							))}
						</FormGroup>
					</FormControl>
				</Paper>
			</Box>

			{/* Bouton de validation centré */}
			<Button
				type="submit"
				variant="contained"
				color="primary"
				sx={{ marginTop: 2 }}>
				S'inscrire
			</Button>
		</Box>
	);
};

export default SignupForm;
