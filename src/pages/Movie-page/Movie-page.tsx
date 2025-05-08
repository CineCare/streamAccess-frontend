import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import { Movie, ApiError } from "../../types/interfaces";
import { fetchMovieById, fetchProducers, fetchDirectors } from "../../services/FetcherService";
import CommentSection from "../../components/CommentSection/CommentSection";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import useVideoStream from "../../hooks/useVideoStream";
import MovieContent from "../../components/MovieContent/MovieContent";

const MoviePage = () => {
	const { id } = useParams<{ id: string }>();
	const { url: streamUrl, error: streamError, isLoading: streamLoading } = useVideoStream();

	// Fetch movie details
	const {
		data: movie,
		error,
		isLoading,
	} = useQuery<Movie, ApiError>(["movie", id], () => fetchMovieById(Number(id)), {
		enabled: !!id,
	});

	// Fetch producers and directors
	const { data: producers } = useQuery("producers", fetchProducers);
	const { data: directors } = useQuery("directors", fetchDirectors);

	// Get producer and director names
	const producerName = producers?.find(p => p.id === movie?.producerId)?.name || "Inconnu";
	const directorName = directors?.find(d => d.id === movie?.directorId)?.name || "Inconnu";

	if (isLoading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (error || !movie) {
		return (
			<Box
				sx={{
					padding: 3,
					textAlign: "center",
					height: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Typography variant="h4" color="error">
					{error ? error.message : "Film non trouvé"}
				</Typography>
			</Box>
		);
	}

	return (
		<>
			<Navbar />
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "1fr 3fr",
					gridTemplateRows: "1fr auto",
					height: "92vh",
					width: "100%",
					padding: 3,
					gap: 2,
				}}
			>
				{/* Movie Content */}
				<MovieContent movie={movie} producerName={producerName} directorName={directorName} />

				{/* Video Player */}
				<Box
					sx={{
						width: "100%",
						height: "100%",
						backgroundColor: "black",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						position: "relative",
						aspectRatio: "16/9",
						borderRadius: 2,
						overflow: "hidden",
					}}
				>
					{streamLoading ? (
						<CircularProgress sx={{ color: "white" }} />
					) : streamUrl ? (
						<VideoPlayer url={streamUrl} />
					) : (
						<Typography color="error">{streamError || "Erreur de chargement"}</Typography>
					)}
				</Box>

				{/* Comment Section */}
				<CommentSection />
			</Box>
		</>
	);
};

export default MoviePage;
