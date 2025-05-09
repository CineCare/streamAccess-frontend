import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, List, ListItem, IconButton, Popover, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchTags, createTag, deleteTag, updateTag } from "../../services/FetcherService";

const TagManagement: React.FC = () => {
	const [tags, setTags] = useState<{ id: number; label: string }[]>([]);
	const [formData, setFormData] = useState({ label: "" });
	const [editData, setEditData] = useState<{ id: number; label: string } | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	// Fetch tags on load
	useEffect(() => {
		const fetchData = async () => {
			try {
				const tagsList = await fetchTags();
				setTags(tagsList);
			} catch {
				setError("Erreur lors du chargement des tags.");
			}
		};
		fetchData();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		setError(null);
		setSuccess(false);

		try {
			await createTag(formData.label);
			setSuccess(true);
			setFormData({ label: "" });

			// Refresh tags
			const tagsList = await fetchTags();
			setTags(tagsList);
		} catch {
			setError("Erreur lors de l'ajout du tag.");
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await deleteTag(id);

			// Refresh tags
			const tagsList = await fetchTags();
			setTags(tagsList);
		} catch {
			setError("Erreur lors de la suppression du tag.");
		}
	};

	const handleEdit = (id: number) => {
		const tag = tags.find(t => t.id === id);
		if (tag) {
			setEditData(tag);
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
			await updateTag(editData.id, editData.label);

			// Refresh tags
			const tagsList = await fetchTags();
			setTags(tagsList);

			setEditDialogOpen(false);
			setEditData(null);
		} catch {
			setError("Erreur lors de la modification du tag.");
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
				Gestion des tags
			</Typography>

			{/* Formulaire d'ajout */}
			<Box sx={{ marginBottom: 3 }}>
				<Typography variant="body1" sx={{ marginBottom: 1 }}>
					Ajouter un tag
				</Typography>
				<TextField
					fullWidth
					label="Label"
					name="label"
					value={formData.label}
					onChange={handleChange}
					sx={{ marginBottom: 2 }}
				/>
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
						Tag ajouté avec succès !
					</Typography>
				)}
			</Box>

			{/* Bouton pour afficher les tags */}
			<Button
				variant="outlined"
				color="primary"
				fullWidth
				onClick={handleOpenPopover}
				sx={{ marginBottom: 2 }}
			>
				Gérer les tags
			</Button>

			{/* Popover pour afficher les tags */}
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
						Tags
					</Typography>
					<List>
						{tags.map(tag => (
							<ListItem
								key={tag.id}
								secondaryAction={
									<>
										<IconButton disabled color="primary" onClick={() => handleEdit(tag.id)}>
											<EditIcon />
										</IconButton>
										<IconButton
											color="error"
											onClick={() => handleDelete(tag.id)}
										>
											<DeleteIcon />
										</IconButton>
									</>
								}
							>
								{tag.label}
							</ListItem>
						))}
					</List>
				</Box>
			</Popover>

			{/* Dialog pour modification */}
			<Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
				<DialogTitle>Modifier un tag</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label="Label"
						name="label"
						value={editData?.label || ""}
						onChange={handleEditChange}
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

export default TagManagement;
