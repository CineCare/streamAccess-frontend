import { useState, useEffect, Key, ReactElement, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Grid,
	Typography,
	Card,
	CardContent,
	CardMedia,
	TextField,
	Autocomplete,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	useTheme,
	alpha,
	Stack,
	IconButton,
	Pagination,
	Button,
	Divider,
} from "@mui/material";
import DvrIcon from "@mui/icons-material/Dvr";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import WcIcon from '@mui/icons-material/Wc';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import ChurchIcon from '@mui/icons-material/Church';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState, fetchMovies, AppDispatch } from "../../providers/store";
import { Movie } from "../../types/interfaces";
import useFetchMovies from "../../hooks/useFetchMovies";
import { fetchProducers, fetchDirectors } from "../../services/FetcherService";

const tagIcons: { [key: string]: ReactElement } = {
	"Sous-titres disponibles": <SubtitlesIcon />,
	"Audio description": <DvrIcon />,
	"Scènes violentes": <SportsKabaddiIcon />,
	"Sexe explicite": <WcIcon />,
	"Anti stress": <SelfImprovementIcon />,
	"Angoissant": <SentimentVeryDissatisfiedIcon />,
	"Addiction": <SmokingRoomsIcon />,
	"Deuil": <ChurchIcon />,
};
const moviesPerPage = 16;

const Movies = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const movies = useSelector((state: RootState) => state.movies.list); // Récupère la liste des films depuis le store
	const tags = useSelector((state: RootState) => state.tags.list); // Récupère les tags depuis le store
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [yearFilter, setYearFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [flippedCard, setFlippedCard] = useState<number | null>(null);
	const [openModal, setOpenModal] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
	const [producers, setProducers] = useState<{ id: number; name: string }[]>([]);
	const [directors, setDirectors] = useState<{ id: number; name: string }[]>([]);

	// Fetch producers and directors on page load
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [producersList, directorsList] = await Promise.all([fetchProducers(), fetchDirectors()]);
				setProducers(producersList);
				setDirectors(directorsList);
			} catch (error) {
				console.error("Erreur lors du chargement des producteurs et réalisateurs :", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (!openModal) {
			setFlippedCard(null);
		}
	}, [openModal]);

	const filteredMovies = movies.filter(
		movie =>
			movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
			(selectedTags.length === 0 || selectedTags.every(tag => movie.tags.includes(tag))) &&
			(yearFilter === "" || movie.releaseYear.toString() === yearFilter)
	);

	const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
	const paginatedMovies = filteredMovies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage);

	const handleOpenModal = (movie: Movie) => {
		setSelectedMovie(movie);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedMovie(null);
	};

	const dispatch = useDispatch<AppDispatch>();
	
	useEffect(() => {
		dispatch(fetchMovies()); // Charge les films dans le store après authentification
	}, [dispatch]);

	useFetchMovies(); // Utilise le hook pour charger les films

	return (
		<Box>
			{/* Barre de Navigation */}
			<Navbar />

			<Box sx={{ padding: 2 }}>
				{/* Filtres et Recherche */}
				<Grid
					container
					spacing={2}
					alignItems="center">
					<Grid size={{ xs: 12, md: 4 }}>
						<TextField
							fullWidth
							label="Rechercher un film"
							variant="outlined"
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 4 }}>
						<Autocomplete
							multiple
							options={tags} // Utilise les tags du store
							getOptionLabel={option => option}
							value={selectedTags}
							onChange={(_, newValue) => setSelectedTags(newValue)}
							renderInput={params => (
								<TextField
									{...params}
									label="Filtrer par tags"
								/>
							)}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 4 }}>
						<FormControl fullWidth>
							<InputLabel>Année</InputLabel>
							<Select
								value={yearFilter}
								onChange={e => setYearFilter(e.target.value)}>
								<MenuItem value="">Toutes</MenuItem>
								{[...new Set(movies.map(m => m.releaseYear))]
									.sort((a, b) => b - a)
									.map(year => (
										<MenuItem
											key={year}
											value={year.toString()}>
											{year}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</Grid>
				</Grid>

				<Box sx={{ display: "flex", flexDirection: "column", minHeight: "84vh" }}>
					{/* Contenu principal des films */}
					<Box sx={{ flexGrow: 1 }}>
						<Grid
							container
							spacing={2}
							sx={{
								marginTop: 0.5,
								justifyContent: "center",
							}}>
							{paginatedMovies.map(movie => {
								const tagIconsToShow = movie.tags.map(tag => tagIcons[tag]);
								return (
									<Grid
										size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 1.5 }}
										key={movie.id}>
										<Box
											sx={{
												perspective: "1000px",
												position: "relative",
												height: { xs: "50vh", sm: "40vh", md: "37vh" },
												"&:hover": { boxShadow: theme.shadows[4] },
											}}>
											<Box
												className="flip-card-inner"
												sx={{
													position: "relative",
													width: "100%",
													height: "100%",
													transformStyle: "preserve-3d",
													transition: "transform 0.6s",
													transform: flippedCard === movie.id ? "rotateY(180deg)" : "none",
												}}
												onClick={() => {
													if (!openModal) {
														setFlippedCard(flippedCard === movie.id ? null : movie.id);
													}
												}}>
												{/* Face avant */}
												<Card
													sx={{
														position: "absolute",
														width: "100%",
														height: "100%",
														aspectRatio: "2 / 3",
														display: "flex",
														flexDirection: "row",
														backgroundColor: theme.palette.background.paper,
														backfaceVisibility: "hidden",
														boxShadow: theme.shadows[3],
													}}>
													{/* Affiche */}
													<CardMedia
														component="img"
														sx={{
															width: "100%",
															height: "100%",
															objectFit: "cover",
															position: "relative",
															borderTopLeftRadius: 8,
															borderBottomLeftRadius: 8,
														}}
														image={movie.image ? `https://streamaccess-dev-backend.codevert.org/assets/movies_images/${movie.image}` : "/images/camera.png"}
														alt={`Affiche du film ${movie.title}`}
														onError={e => {
															(e.target as HTMLImageElement).onerror = null;
															(e.target as HTMLImageElement).src = "/images/camera.png";
														}}
													/>
													{/* Icône de lecture */}
													<IconButton
														sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: alpha(theme.palette.primary.main, 0.6), color: "white" }}
														onClick={e => {
															e.stopPropagation();
															navigate(`/movie/${movie.id}`);
														}}>
														<PlayCircleIcon fontSize="large" />
													</IconButton>
													{/* Infos en bas */}
													<CardContent
														sx={{ width: "100%", position: "absolute", bottom: 0, padding: 0.5, color: theme.palette.text.primary, backgroundColor: alpha(theme.palette.background.default, 0.7) }}>
														<Typography
															variant="h6"
															sx={{
																overflow: "hidden",
																textOverflow: "ellipsis",
																whiteSpace: "nowrap",
																width: "100%",
															}}>
															{movie.title}
														</Typography>

														<Stack
															direction="row"
															justifyContent="space-between"
															alignItems="center">
															<Typography variant="body2">{movie.releaseYear}</Typography>
															<Stack
																direction="row"
																spacing={0.5}>
																{tagIconsToShow.map((icon: ReactElement, index: Key) => (
																	<Box key={index}>{icon}</Box>
																))}
															</Stack>
														</Stack>
													</CardContent>
												</Card>

												{/* Face arrière */}
												<Card
													sx={{
														position: "absolute",
														width: "100%",
														height: "100%",
														backfaceVisibility: "hidden",
														transform: "rotateY(180deg)",
														backgroundColor: theme.palette.background.paper,
														display: "flex",
														flexDirection: "column",
														justifyContent: "space-between",
														padding: "20px",
														color: theme.palette.text.primary,
														boxShadow: theme.shadows[4],
														borderRadius: 2,
													}}>
													<Box>
														<Typography
															variant="h6"
															sx={{ fontWeight: "bold", marginBottom: 1 }}>
															{movie.title}
														</Typography>
														<Divider sx={{ marginBottom: 1 }} />
														<Typography
															variant="body2"
															sx={{ marginBottom: 1 }}>
															{movie.shortSynopsis || "Non disponible"}
														</Typography>
													</Box>
													<Box
														sx={{
															marginTop: "auto",
															paddingTop: 1,
															borderTop: `1px solid ${theme.palette.divider}`,
														}}>
														<Typography
															variant="body2"
															sx={{ fontStyle: "italic", color: "gray" }}>
															<strong>Commentaire :</strong> {movie.teamComment ? `${movie.teamComment.substring(0, 50)}...` : "Non disponible"}
														</Typography>
													</Box>
													<IconButton
														sx={{
															position: "absolute",
															top: 8,
															right: 8,
															backgroundColor: alpha(theme.palette.primary.main, 0.7),
															color: "white",
															"&:hover": { backgroundColor: theme.palette.primary.dark },
														}}
														onClick={e => {
															e.stopPropagation();
															handleOpenModal(movie);
														}}>
														<ZoomOutMapIcon />
													</IconButton>
												</Card>
											</Box>
										</Box>
									</Grid>
								);
							})}
						</Grid>
					</Box>

					{/* Modale */}
					<Dialog
						open={openModal}
						onClose={handleCloseModal}
						maxWidth="md"
						fullWidth
						sx={{
							"& .MuiBackdrop-root": {
								backgroundColor: alpha(theme.palette.background.default, 0.1),
							},
						}}>
						{selectedMovie && (
							<>
								<DialogTitle sx={{ backgroundColor: theme.palette.primary.main + "20" }}>{selectedMovie.title}</DialogTitle>
								<DialogContent dividers>
									<Grid
										container
										spacing={2}>
										{/* Affiche du film */}
										<Grid size={{ xs: 12, sm: 4 }}>
											<CardMedia
												component="img"
												sx={{ width: "100%", borderRadius: 1 }}
												image={selectedMovie.image ? `https://streamaccess-dev-backend.codevert.org/assets/movies_images/${selectedMovie.image}` : "/images/camera.png"}
												alt={`Affiche du film ${selectedMovie.title}`}
											/>
										</Grid>

										{/* Informations */}
										<Grid size={{ xs: 12, sm: 8 }} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
											<Box>
												<Typography
													variant="body1"
													sx={{ marginBottom: 1 }}>
													<strong>Producteur :</strong> {producers.find(p => p.id === selectedMovie.producerId)?.name || "Non disponible"}
												</Typography>
												<Typography
													variant="body1"
													sx={{ marginBottom: 1 }}>
													<strong>Réalisateur :</strong> {directors.find(d => d.id === selectedMovie.directorId)?.name || "Non disponible"}
												</Typography>
												<Typography
													variant="body1"
													sx={{ marginBottom: 1 }}>
													<strong>Année :</strong> {selectedMovie.releaseYear || "Non disponible"}
												</Typography>
												<Divider sx={{ marginBottom: 1 }} />
												<Typography
													variant="body1"
													sx={{
														marginBottom: 2,
														whiteSpace: "pre-wrap", // Permet de conserver les retours à la ligne
														wordWrap: "break-word", // Permet de couper les mots trop longs
													}}>
													{selectedMovie.longSynopsis || "Non disponible"}
												</Typography>
											</Box>
											<Box
												sx={{
													marginTop: "auto",
													paddingTop: 1,
													borderTop: `1px solid ${theme.palette.divider}`,
												}}>
												<Typography
													variant="body2"
													sx={{ fontStyle: "italic", color: "gray" }}>
													<strong>Commentaire de l'équipe :</strong> {selectedMovie.teamComment || "Non disponible"}
												</Typography>
											</Box>
										</Grid>
									</Grid>
								</DialogContent>

								<DialogActions>
									<Button
										variant="contained"
										color="primary"
										onClick={() => navigate(`/movie/${selectedMovie.id}`)}>
										Voir le film
									</Button>
									<Button
										onClick={handleCloseModal}
										color="secondary">
										Fermer
									</Button>
								</DialogActions>
							</>
						)}
					</Dialog>

					{/* Pagination */}
					<Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
						<Pagination
							count={totalPages}
							page={currentPage}
							onChange={(_, newPage: SetStateAction<number>) => setCurrentPage(newPage)}
							color="primary"
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Movies;
