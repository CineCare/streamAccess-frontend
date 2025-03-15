import { useState, useEffect, useCallback, Key, ReactElement, SetStateAction } from "react";
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
} from "@mui/material";
import DvrIcon from "@mui/icons-material/Dvr";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar.tsx";

interface Movie {
	id: number;
	title: string;
	releaseYear: number;
	image?: string;
	producerId?: number;
	directorId?: number | null;
	shortSynopsis?: string | null;
	longSynopsis?: string | null;
	teamComment?: string | null;
	tags: string[];
}

const mockTags = ["Sous-titres disponibles", "Scènes violentes", "Accessible", "Audio description"];

const tagIcons: { [key: string]: ReactElement } = {
	"Sous-titres disponibles": <SubtitlesIcon />,
	"Scènes violentes": <DvrIcon />,
	Accessible: <AccessibilityNewIcon />,
	"Audio description": <DvrIcon />,
};
const moviesPerPage = 12;

const Movies = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [movies, setMovies] = useState<Movie[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [yearFilter, setYearFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [flippedCard, setFlippedCard] = useState<number | null>(null);
	const [openModal, setOpenModal] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

	const fetchMovies = useCallback(async () => {
		try {
			const token = localStorage.getItem("accessToken");
			if (!token) throw new Error("Token manquant !");

			const response = await fetch(`https://streamaccess-dev-backend.codevert.org/movies`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Erreur : ${response.status} (${response.statusText})`);
			}

			const data: Movie[] = await response.json();
			setMovies(data);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			} else {
				console.error("An unknown error occurred");
			}
		}
	}, []);

	useEffect(() => {
		fetchMovies();
	}, [fetchMovies]);

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

	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedMovie(null);
	};

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
					<Grid
						item
						xs={12}
						md={4}>
						<TextField
							fullWidth
							label="Rechercher un film"
							variant="outlined"
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={4}>
						<Autocomplete
							multiple
							options={mockTags}
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

					<Grid
						item
						xs={12}
						md={4}>
						<FormControl fullWidth>
							<InputLabel>Année</InputLabel>
							<Select
								value={yearFilter}
								onChange={e => setYearFilter(e.target.value)}>
								<MenuItem value="">Toutes</MenuItem>
								{[...new Set(movies.map(m => m.releaseYear))].map(year => (
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
							sx={{ marginTop: 0.5 }}>
							{paginatedMovies.map(movie => {
								const tagIconsToShow = movie.tags.map(tag => tagIcons[tag]);
								return (
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										lg={3}
										xl={2}
										key={movie.id}>
										<Box
											sx={{
												perspective: "1000px",
												position: "relative",
												height: "37vh",
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
														<Typography variant="h6">{movie.title}</Typography>

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
															setSelectedMovie(movie);
															setOpenModal(true);
														}}>
														<ZoomOutMapIcon />
													</IconButton>
													<Box>
														<Typography variant="h6">{movie.title}</Typography>
														<Box
															sx={{
																overflow: "hidden",
																display: "-webkit-box",
																WebkitBoxOrient: "vertical",
																WebkitLineClamp: flippedCard !== movie.id ? "unset" : "10",
															}}>
															<Typography variant="body2">{movie.longSynopsis || "Synopsis non disponible"}</Typography>
														</Box>
													</Box>
													<Box>
														<Typography variant="body2">{movie.teamComment || "Aucun commentaire de l'équipe"}</Typography>
														<Button
															variant="contained"
															color="primary"
															sx={{ marginTop: 2 }}
															fullWidth
															onClick={() => navigate(`/movie/${movie.id}`)}>
															Voir le film
														</Button>
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
																	<DialogTitle>{selectedMovie.title}</DialogTitle>
																	<DialogContent dividers>
																		<Grid
																			container
																			spacing={2}>
																			{/* Affiche du film */}
																			<Grid
																				item
																				xs={12}
																				md={4}>
																				<CardMedia
																					component="img"
																					sx={{ width: "100%", borderRadius: 1 }}
																					image={selectedMovie.image ? `https://streamaccess-dev-backend.codevert.org/assets/movies_images/${selectedMovie.image}` : "/images/camera.png"}
																					alt={`Affiche du film ${selectedMovie.title}`}
																				/>
																			</Grid>

																			{/* Informations */}
																			<Grid
																				item
																				xs={12}
																				md={8}>
																				<Typography
																					variant="body1"
																					sx={{ marginBottom: 1 }}>
																					{selectedMovie.longSynopsis || "Synopsis non disponible"}
																				</Typography>
																				<Typography
																					variant="body2"
																					sx={{ fontStyle: "italic", color: "gray", marginBottom: 2 }}>
																					{selectedMovie.teamComment || "Aucun commentaire de l'équipe"}
																				</Typography>
																			</Grid>
																		</Grid>
																	</DialogContent>

																	<DialogActions>
																		<Button
																			onClick={() => setOpenModal(false)}
																			color="secondary">
																			Fermer
																		</Button>
																		<Button
																			variant="contained"
																			color="primary"
																			onClick={() => navigate(`/movie/${selectedMovie.id}`)}>
																			Voir le film
																		</Button>
																	</DialogActions>
																</>
															)}
														</Dialog>
													</Box>
												</Card>
											</Box>
										</Box>
									</Grid>
								);
							})}
						</Grid>
					</Box>

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
