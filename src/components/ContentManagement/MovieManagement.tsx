import React, { useState } from "react";
import { Box, Typography, Button, MenuItem, TextField, ListItemText, IconButton, Popover, List } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, removeMovie } from "../../providers/store"; // Importer removeMovie
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteMovie } from "../../services/FetcherService";
import useFetchMovies from "../../hooks/useFetchMovies";

const MovieManagement: React.FC = () => {
	// Navigation et état global
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const movies = useSelector((state: RootState) => state.movies.list);

	// États locaux
	const [searchQuery, setSearchQuery] = useState("");
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	// Utilise le hook pour charger les films
	useFetchMovies();

	// Gestion des actions
	const handleCreateMovie = () => {
		navigate("/createmovie");
	};

	const handleEditMovie = (id: number) => {
		navigate(`/editmovie/${id}`);
	};

	const handleDeleteMovie = async (id: number) => {
		try {
			await deleteMovie(id); // Supprime le film via l'API
			dispatch(removeMovie(id)); // Met à jour le store Redux
		} catch (error) {
			console.error("Erreur lors de la suppression du film :", error);
		}
	};

	const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
	};

	// Filtrage des films
	const filteredMovies = searchQuery
		? movies.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
		: movies;

	return (
		<Box sx={{ padding: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
			<Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
				Gestion des films
			</Typography>
			<Typography variant="body1" sx={{ marginBottom: 2 }}>
				Nombre total de films : {movies.length}
			</Typography>
			<Box>
				<Button
					variant="contained"
					color="primary"
					fullWidth
					sx={{ marginBottom: 2 }}
					onClick={handleCreateMovie}
				>
					Ajouter un film
				</Button>
				<Button
					variant="outlined"
					color="primary"
					fullWidth
					onClick={handleOpenPopover}
					sx={{ marginBottom: 2 }}
				>
					Gérer les films
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
									}}
								>
									<ListItemText primary={movie.title} />
									<Box>
										<IconButton
											color="primary"
											onClick={() => handleEditMovie(movie.id)}
										>
											<EditIcon />
										</IconButton>
										<IconButton
											color="error"
											onClick={() => handleDeleteMovie(movie.id)}
										>
											<DeleteIcon />
										</IconButton>
									</Box>
								</MenuItem>
							))}
						</List>
					</Box>
				</Popover>
			</Box>
		</Box>
	);
};

export default MovieManagement;
