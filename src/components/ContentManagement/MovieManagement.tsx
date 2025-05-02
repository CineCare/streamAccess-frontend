import React, { useState } from "react";
import { Box, Typography, Button, MenuItem, TextField, ListItemText, IconButton, Popover, List } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../providers/store";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const MovieManagement: React.FC = () => {
	const navigate = useNavigate();
	const movies = useSelector((state: RootState) => state.movies.list); // Récupère la liste des films depuis le store
	const [searchQuery, setSearchQuery] = useState("");
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleCreateMovie = () => {
		navigate("/createmovie"); // Redirige vers la page de création de film
	};

	const handleEditMovie = (id: number) => {
		navigate(`/editmovie/${id}`); // Redirige vers la page de modification du film
	};

	const handleDeleteMovie = (id: number) => {
		// Logique de suppression (à implémenter)
		console.log(`Supprimer le film avec l'ID : ${id}`);
	};

	const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
	};

	const filteredMovies = searchQuery ? movies.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase())) : movies; // Si la barre de recherche est vide, affiche tous les films

	return (
		<Box sx={{ padding: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 1 }}>
			<Typography
				variant="h6"
				sx={{ fontWeight: "bold", marginBottom: 2 }}>
				Gestion des films
			</Typography>
			<Button
				variant="contained"
				color="primary"
				fullWidth
				sx={{ marginBottom: 2 }}
				onClick={handleCreateMovie}>
				Ajouter un film
			</Button>
			<Button
				variant="outlined"
				color="primary"
				fullWidth
				onClick={handleOpenPopover}
				sx={{ marginBottom: 2 }}>
				Sélectionner un film
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
						maxHeight: 600, // Limite la hauteur du menu
						width: anchorEl ? anchorEl.offsetWidth : "inherit", // Définit la largeur du Popover égale à celle du bouton
					},
				}}>
				<Box sx={{ padding: 2 }}>
					<TextField
						fullWidth
						variant="outlined"
						placeholder="Rechercher un film"
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						sx={{ marginBottom: 2 }}
					/>
					<List>
						{filteredMovies.map(movie => (
							<MenuItem
								key={movie.id}
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}>
								<ListItemText primary={movie.title} />
								<Box>
									<IconButton
										color="primary"
										onClick={() => handleEditMovie(movie.id)}>
										<EditIcon />
									</IconButton>
									<IconButton
										color="error"
										onClick={() => handleDeleteMovie(movie.id)}>
										<DeleteIcon />
									</IconButton>
								</Box>
							</MenuItem>
						))}
					</List>
				</Box>
			</Popover>
		</Box>
	);
};

export default MovieManagement;
