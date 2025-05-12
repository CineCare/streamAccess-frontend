import React, { useState, useEffect } from "react";
import {
	Box, Typography, Button, TextField, List, ListItem, IconButton, Popover,
	Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, InputAdornment, DialogContentText
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import * as MuiIcons from "@mui/icons-material";
import { fetchTags, createTag, deleteTag, updateTag } from "../../services/FetcherService";
import Pagination from "@mui/material/Pagination";
import { useTheme } from "@mui/material/styles";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// Utilitaire pour rendre le label plus lisible
const humanize = (str: string) => str.replace(/([A-Z])/g, " $1").replace(/^ /, "");

const ALL_ICONS = Object.keys(MuiIcons)
	.filter((key) =>
		!key.endsWith("Sharp") &&
		!key.endsWith("Outlined") &&
		!key.endsWith("TwoTone") &&
		!key.endsWith("Rounded") &&
		!key.endsWith("Filled")
	)
	.sort();

const ICONS = ALL_ICONS.slice(0, 40).map((key) => {
	const IconComp = MuiIcons[key as keyof typeof MuiIcons];
	return {
		name: key,
		label: humanize(key),
		component: <IconComp />,
	};
});

const getIconComponent = (iconName: string) => {
	const IconComp = MuiIcons[iconName as keyof typeof MuiIcons];
	return IconComp ? <IconComp /> : <MuiIcons.LocalOffer />;
};

const ICONS_PER_PAGE = 40;

const TagManagement: React.FC<{ sx?: object }> = ({ sx = {} }) => {
	const [tags, setTags] = useState<{ id: number; label: string; icon?: string }[]>([]);
	const [formData, setFormData] = useState({ label: "", icon: ICONS[0]?.name || "LocalOffer" });
	const [editData, setEditData] = useState<{ id: number; label: string; icon: string } | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: number }>({ open: false });
	const [loading, setLoading] = useState(false);
	const [iconSearch, setIconSearch] = useState("");
	const [filteredIcons, setFilteredIcons] = useState(ICONS);
	const [iconPage, setIconPage] = useState(1);
	const theme = useTheme();

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

	useEffect(() => {
		const icons = ALL_ICONS
			.filter(key => humanize(key).toLowerCase().includes(iconSearch.toLowerCase()))
			.map(key => {
				const IconComp = MuiIcons[key as keyof typeof MuiIcons];
				return {
					name: key,
					label: humanize(key),
					component: <IconComp />,
				};
			});
		setFilteredIcons(icons);
		setIconPage(1); // Reset page on search
	}, [iconSearch]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	// const handleIconChange = (e: SelectChangeEvent<string>) => {
	// 	const { name, value } = e.target;
	// 	setFormData(prev => ({
	// 		...prev,
	// 		[name as string]: value,
	// 	}));
	// };

	const handleSubmit = async () => {
		setError(null);
		setSuccess(null);
		setLoading(true);
		try {
			// await createTag(formData.label, formData.icon);
			await createTag(formData.label);
			setSuccess("Tag ajouté avec succès !");
			setFormData({ label: "", icon: filteredIcons[0]?.name || "LocalOffer" });
			const tagsList = await fetchTags();
			setTags(tagsList);
		} catch {
			setError("Erreur lors de l'ajout du tag.");
		}
		setLoading(false);
	};

	const handleDelete = async (id: number) => {
		setLoading(true);
		try {
			await deleteTag(id);
			const tagsList = await fetchTags();
			setTags(tagsList);
			setSuccess("Tag supprimé avec succès !");
		} catch {
			setError("Erreur lors de la suppression du tag.");
		}
		setLoading(false);
		setDeleteDialog({ open: false });
	};

	const handleEdit = (id: number) => {
		const tag = tags.find(t => t.id === id);
		if (tag) {
			setEditData({
				id: tag.id,
				label: tag.label,
				icon: tag.icon && typeof tag.icon === "string" ? tag.icon : filteredIcons[0]?.name || "LocalOffer"
			});
			setEditDialogOpen(true);
		}
	};

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditData(prev => (prev ? { ...prev, [name]: value } : null));
	};

	// const handleEditIconChange = (e: SelectChangeEvent<string>) => {
	// 	const { name, value } = e.target;
	// 	setEditData(prev => (prev ? { ...prev, [name as string]: value } : null));
	// };

	const handleEditSubmit = async () => {
		if (!editData) return;
		setLoading(true);
		try {
			// await updateTag(editData.id, editData.label, editData.icon);
			await updateTag(editData.id, editData.label);
			const tagsList = await fetchTags();
			setTags(tagsList);
			setSuccess("Tag modifié avec succès !");
			setEditDialogOpen(false);
			setEditData(null);
		} catch {
			setError("Erreur lors de la modification du tag.");
		}
		setLoading(false);
	};

	const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
	};

	const handleIconSelect = (iconName: string) => {
		setFormData(prev => ({
			...prev,
			icon: iconName,
		}));
	};

	const handleEditIconSelect = (iconName: string) => {
		setEditData(prev => (prev ? { ...prev, icon: iconName } : null));
	};

	const totalIconPages = Math.ceil(filteredIcons.length / ICONS_PER_PAGE);
	const paginatedIcons = filteredIcons.slice((iconPage - 1) * ICONS_PER_PAGE, iconPage * ICONS_PER_PAGE);

	return (
		<Box sx={{ padding: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 1, height: "100%", ...sx }}>
			<Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
				<LocalOfferIcon sx={{ marginRight: 1 }} />
				<Typography variant="h6" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
					Gestion des tags
				</Typography>
			</Box>

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
					disabled={loading}
				/>
				<TextField
					fullWidth
					label="Rechercher une icône"
					value={iconSearch}
					onChange={e => setIconSearch(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
					sx={{ marginBottom: 2 }}
				/>
				{/* Liste d'icônes paginée */}
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
					{paginatedIcons.map(icon => (
						<Box
							key={icon.name}
							onClick={() => handleIconSelect(icon.name)}
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								border: formData.icon === icon.name
									? `2px solid ${theme.palette.primary.main}`
									: `1px solid ${theme.palette.divider}`,
								borderRadius: 2,
								padding: 1,
								width: 60,
								height: 60,
								backgroundColor: formData.icon === icon.name
									? theme.palette.primary.light
									: theme.palette.background.paper,
								color: formData.icon === icon.name
									? theme.palette.primary.contrastText
									: theme.palette.text.primary,
								transition: "border 0.2s, background 0.2s",
								"&:hover": {
									border: `2px solid ${theme.palette.primary.main}`,
									backgroundColor: theme.palette.action.hover,
								},
							}}
						>
							{React.cloneElement(icon.component, {
								sx: {
									fontSize: 32,
									color: formData.icon === icon.name
										? theme.palette.primary.main
										: theme.palette.text.primary,
								}
							})}
						</Box>
					))}
				</Box>
				{totalIconPages > 1 && (
					<Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
						<Pagination
							count={totalIconPages}
							page={iconPage}
							onChange={(_, page) => setIconPage(page)}
							size="small"
						/>
					</Box>
				)}
				<Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disabled={loading || !formData.label}>
					Ajouter
				</Button>
			</Box>

			<Button
				variant="outlined"
				color="primary"
				fullWidth
				onClick={handleOpenPopover}
				sx={{ marginBottom: 2 }}
			>
				Gérer les tags
			</Button>

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
										<IconButton
											color="primary"
											onClick={() => handleEdit(tag.id)}
											aria-label="Modifier le tag"
											disabled={loading}
										>
											<EditIcon />
										</IconButton>
										<IconButton
											color="error"
											onClick={() => setDeleteDialog({ open: true, id: tag.id })}
											aria-label="Supprimer le tag"
											disabled={loading}
										>
											<DeleteIcon />
										</IconButton>
									</>
								}
							>
								<Box sx={{ display: "flex", alignItems: "center" }}>
									{getIconComponent(tag.icon || ICONS[0]?.name || "LocalOffer")}
									<Typography sx={{ marginLeft: 1 }}>{tag.label}</Typography>
								</Box>
							</ListItem>
						))}
					</List>
				</Box>
			</Popover>

			<Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
				<DialogTitle>Modifier un tag</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label="Label"
						name="label"
						value={editData?.label || ""}
						onChange={handleEditChange}
						sx={{ marginBottom: 2 }}
						disabled={loading}
					/>
					<TextField
						fullWidth
						label="Rechercher une icône"
						value={iconSearch}
						onChange={e => setIconSearch(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
						sx={{ marginBottom: 2 }}
					/>
					{/* Liste d'icônes paginée pour édition */}
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
						{paginatedIcons.map(icon => (
							<Box
								key={icon.name}
								onClick={() => handleEditIconSelect(icon.name)}
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									cursor: "pointer",
									border: editData?.icon === icon.name
										? `2px solid ${theme.palette.primary.main}`
										: `1px solid ${theme.palette.divider}`,
									borderRadius: 2,
									padding: 1,
									width: 60,
									height: 60,
									backgroundColor: editData?.icon === icon.name
										? theme.palette.primary.light
										: theme.palette.background.paper,
									color: editData?.icon === icon.name
										? theme.palette.primary.contrastText
										: theme.palette.text.primary,
									transition: "border 0.2s, background 0.2s",
									"&:hover": {
										border: `2px solid ${theme.palette.primary.main}`,
										backgroundColor: theme.palette.action.hover,
									},
								}}
							>
								{React.cloneElement(icon.component, {
									sx: {
										fontSize: 32,
										color: editData?.icon === icon.name
											? theme.palette.primary.main
											: theme.palette.text.primary,
									}
								})}
								<Typography variant="caption" sx={{ fontSize: 10, textAlign: "center" }}>
									{icon.label}
								</Typography>
							</Box>
						))}
					</Box>
					{totalIconPages > 1 && (
						<Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
							<Pagination
								count={totalIconPages}
								page={iconPage}
								onChange={(_, page) => setIconPage(page)}
								size="small"
							/>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditDialogOpen(false)} color="secondary" disabled={loading}>
						Annuler
					</Button>
					<Button onClick={handleEditSubmit} color="primary" disabled={loading || !editData?.label}>
						Enregistrer
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false })}>
				<DialogTitle>Confirmer la suppression</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Êtes-vous sûr de vouloir supprimer ce tag ? Cette action est irréversible.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteDialog({ open: false })} color="secondary" disabled={loading}>
						Annuler
					</Button>
					<Button
						onClick={() => handleDelete(deleteDialog.id!)}
						color="error"
						variant="contained"
						disabled={loading}
					>
						Supprimer
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={!!success || !!error}
				autoHideDuration={4000}
				onClose={() => { setSuccess(null); setError(null); }}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				{success ? (
					<Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: "100%" }}>
						{success}
					</Alert>
				) : error ? (
					<Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
						{error}
					</Alert>
				) : undefined}
			</Snackbar>
		</Box>
	);
};

export default TagManagement;
