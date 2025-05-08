import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, MenuItem, Select, FormControl, InputLabel, List, ListItem, IconButton, Popover, Dialog, DialogTitle, DialogContent, DialogActions, SelectChangeEvent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchProducers, fetchDirectors, createPerson, deletePerson, updatePerson } from "../../services/FetcherService";

const PersonManagement: React.FC = () => {
	const [producers, setProducers] = useState<{ id: number; name: string; biography?: string }[]>([]);
	const [directors, setDirectors] = useState<{ id: number; name: string; biography?: string }[]>([]);
	const [formData, setFormData] = useState({ name: "", role: "producer" as "producer" | "director" });
	const [editData, setEditData] = useState<{ id: number; name: string; biography?: string; role: "producer" | "director" } | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	// Fetch producers and directors on load
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [producersList, directorsList] = await Promise.all([fetchProducers(), fetchDirectors()]);
				setProducers(producersList);
				setDirectors(directorsList);
			} catch {
				setError("Erreur lors du chargement des données.");
			}
		};
		fetchData();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name!]: value,
		}));
	};

	const handleSelectChange = (e: SelectChangeEvent<"producer" | "director">) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name!]: value,
		}));
	};

	const handleSubmit = async () => {
		setError(null);
		setSuccess(false);

		try {
			await createPerson(formData.name, formData.role);
			setSuccess(true);
			setFormData({ name: "", role: "producer" });

			// Refresh lists
			const [producersList, directorsList] = await Promise.all([fetchProducers(), fetchDirectors()]);
			setProducers(producersList);
			setDirectors(directorsList);
		} catch {
			setError("Erreur lors de l'ajout de la personne.");
		}
	};

	const handleDelete = async (id: number, role: "producer" | "director") => {
		try {
			await deletePerson(id, role);

			// Refresh lists
			const [producersList, directorsList] = await Promise.all([fetchProducers(), fetchDirectors()]);
			setProducers(producersList);
			setDirectors(directorsList);
		} catch {
			setError("Erreur lors de la suppression de la personne.");
		}
	};

	const handleEdit = (id: number, role: "producer" | "director") => {
		const person = role === "producer" ? producers.find(p => p.id === id) : directors.find(d => d.id === id);
		if (person) {
			setEditData({ ...person, role });
			setEditDialogOpen(true);
		}
	};

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditData(prev => (prev ? { ...prev, [name]: value } : null));
	};

	const handleEditSubmit = async () => {
		if (!editData) return;

		try {
			await updatePerson(editData.id, editData.name, editData.biography || "", editData.role);

			// Refresh lists
			const [producersList, directorsList] = await Promise.all([fetchProducers(), fetchDirectors()]);
			setProducers(producersList);
			setDirectors(directorsList);

			setEditDialogOpen(false);
			setEditData(null);
		} catch {
			setError("Erreur lors de la modification de la personne.");
		}
	};

	const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
	};

	return (
		<Box sx={{ padding: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 1 }}>
			<Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
				Gestion des personnes
			</Typography>

			{/* Formulaire d'ajout */}
			<Box sx={{ marginBottom: 3 }}>
				<Typography variant="body1" sx={{ marginBottom: 1 }}>
					Ajouter une personne
				</Typography>
				<TextField
					fullWidth
					label="Nom"
					name="name"
					value={formData.name}
					onChange={handleChange}
					sx={{ marginBottom: 2 }}
				/>
				<FormControl fullWidth sx={{ marginBottom: 2 }}>
					<InputLabel>Rôle</InputLabel>
					<Select
						name="role"
						value={formData.role}
						onChange={handleSelectChange}
					>
						<MenuItem value="producer">Producteur</MenuItem>
						<MenuItem value="director">Réalisateur</MenuItem>
					</Select>
				</FormControl>
				<Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
					Ajouter
				</Button>
				{error && (
					<Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
						{error}
					</Typography>
				)}
				{success && (
					<Typography variant="body2" color="success.main" sx={{ marginTop: 2 }}>
						Personne ajoutée avec succès !
					</Typography>
				)}
			</Box>

			{/* Bouton pour afficher les listes */}
			<Button
				variant="outlined"
				color="primary"
				fullWidth
				onClick={handleOpenPopover}
				sx={{ marginBottom: 2 }}
			>
				Gérer les producteurs et réalisateurs
			</Button>

			{/* Popover pour afficher les listes */}
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handleClosePopover}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				PaperProps={{
					style: {
						maxHeight: 600,
						width: anchorEl ? anchorEl.offsetWidth : "inherit",
					},
				}}
			>
				<Box sx={{ padding: 2 }}>
					<Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: 2 }}>
						Producteurs
					</Typography>
					<List>
						{producers.map(producer => (
							<ListItem
								key={producer.id}
								secondaryAction={
									<>
										<IconButton color="primary" onClick={() => handleEdit(producer.id, "producer")}>
											<EditIcon />
										</IconButton>
										<IconButton
											color="error"
											onClick={() => handleDelete(producer.id, "producer")}
										>
											<DeleteIcon />
										</IconButton>
									</>
								}
							>
								{producer.name}
							</ListItem>
						))}
					</List>

					<Typography variant="body1" sx={{ fontWeight: "bold", marginTop: 3, marginBottom: 2 }}>
						Réalisateurs
					</Typography>
					<List>
						{directors.map(director => (
							<ListItem
								key={director.id}
								secondaryAction={
									<>
										<IconButton color="primary" onClick={() => handleEdit(director.id, "director")}>
											<EditIcon />
										</IconButton>
										<IconButton
											color="error"
											onClick={() => handleDelete(director.id, "director")}
										>
											<DeleteIcon />
										</IconButton>
									</>
								}
							>
								{director.name}
							</ListItem>
						))}
					</List>
				</Box>
			</Popover>

			{/* Dialog pour modification */}
			<Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
				<DialogTitle>Modifier une personne</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label="Nom"
						name="name"
						value={editData?.name || ""}
						onChange={handleEditChange}
						sx={{ marginBottom: 2 }}
					/>
					<TextField
						fullWidth
						label="Biographie"
						name="biography"
						value={editData?.biography || ""}
						onChange={handleEditChange}
						multiline
						rows={4}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditDialogOpen(false)} color="secondary">
						Annuler
					</Button>
					<Button onClick={handleEditSubmit} color="primary">
						Enregistrer
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default PersonManagement;
