// src/components/LoginForm.tsx
import React, { useState } from "react";
import { TextField, Button, Box, CardContent, Card } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../providers/store";

interface LoginFormProps {
	onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Logique de connexion (simulée ici, à remplacer par une vraie API)
		dispatch(login());
		onLogin();
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
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
					<TextField
						label="Mot de passe"
						type="password"
            fullWidth
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
					<Button
						type="submit"
						variant="contained"
						color="primary">
						Se connecter
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
};

export default LoginForm;
