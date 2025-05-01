import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, useTheme } from "@mui/material";
import LoginForm from "../../components/LoginForm/LoginForm";
import SignupForm from "../../components/SignupForm/SignupForm";
import Logo from "../../components/Logo/Logo";
import AccessibilityOptions from "../../components/AccessibilityOptions/AccessibilityOptions";
import SelectedPreferences from "../../components/SelectedPreferences/SelectedPreferences";
import EcoStats from "../../components/EcoStats/EcoStats";
import ThemeSwitcher from "../../components/ThemeSwitcher/ThemeSwitcher";

const AuthPage: React.FC = () => {
	const theme = useTheme();
	const [value, setValue] = useState(0); // 0 pour Signup, 1 pour Login

	//@ts-expect-error event unused
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: "100%", maxWidth: "60vw", margin: "auto", padding: 2, textAlign: "center" }}>
			<Box
				sx={{
					position: "absolute",
					top: 16, // Ajuster la distance du haut
					left: 16, // Ajuster la distance de la gauche
					zIndex: 1000, // Assurer que le composant reste au-dessus du contenu
					width: "99%", // Ajuster la largeur
				}}>
				<SelectedPreferences />
			</Box>
			<EcoStats />
			<Box
				component="figure"
				sx={{ display: "inline-block" }}>
				<Typography
					variant="h1"
					sx={{
						fontFamily: "'Nunito Sans', sans-serif",
						fontWeight: 700,
						fontSize: "4rem",
					}}>
					<span style={{ color: theme.palette.text.primary }}>Stream</span>
					<span style={{ color: theme.palette.primary.light }}>Access</span>
				</Typography>
			</Box>
			<Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
				<Logo
					customColor={theme.palette.primary.main}
					width={160}
				/>
			</Box>

			<Tabs
				value={value}
				onChange={handleChange}
				centered>
				<Tab label="Inscription" />
				<Tab label="Connexion" />
				<Tab label="Options d'accessibilité" />
			</Tabs>
			<Box sx={{ marginTop: 4 }}>
				{value === 0 && <SignupForm />}
				{value === 1 && <LoginForm />}
				{value === 2 && <AccessibilityOptions />}
			</Box>
			<Box
				sx={{
					position: "absolute",
					bottom: 16, // Positionné en bas
					left: 16, // Positionné à gauche
					zIndex: 1000, // Assure que le composant reste au-dessus du contenu
				}}
			>
				<ThemeSwitcher layout="vertical" showLabels={false} /> {/* Icônes verticales sans labels */}
			</Box>
		</Box>
	);
};

export default AuthPage;
