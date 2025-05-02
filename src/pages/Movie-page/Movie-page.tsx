import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Card, CardMedia, Button, TextField, Chip, Avatar, Collapse, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Navbar from "../../components/Navbar/Navbar";
import { useAvatar } from '../../hooks/useAvatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../providers/store';

// Types et interfaces
interface Movie {
	id: number;
	title: string;
	releaseYear: number;
	image?: string;
	producerId?: number;
	directorId?: number;
	shortSynopsis?: string;
	longSynopsis?: string;
	teamComment?: string;
	tags: string[];
}

interface ApiError {
	status: number;
	statusText: string;
	message: string;
}

interface Comment {
	id: number;
	userId: number;
	userName: string;
	userAvatar?: string;
	content: string;
	createdAt: string;
}

// Données mockées pour les commentaires
const mockComments: Comment[] = [
	{
		id: 1,
		userId: 1,
		userName: "Marie D.",
		content: "Excellent film, j'ai particulièrement apprécié l'audio description qui est très bien faite.",
		createdAt: "2024-01-15T14:23:00Z"
	},
	{
		id: 2,
		userId: 2,
		userName: "Thomas R.",
		userAvatar: "https://i.pravatar.cc/150?u=2",
		content: "Les sous-titres sont très clairs et bien synchronisés. Merci !",
		createdAt: "2024-01-14T09:15:00Z"
	}
];

// -- Récupération des infos film --
const fetchMovieById = async (id: number): Promise<Movie> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`https://streamaccess-dev-backend.codevert.org/movies/${id}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error: ApiError = {
			status: response.status,
			statusText: response.statusText,
			message: `Erreur : ${response.status} (${response.statusText})`,
		};
		throw error;
	}

	return response.json();
};

// -- Récupération du flux vidéo --
const fetchStreamUrl = async (): Promise<string> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`https://streamaccess-dev-backend.codevert.org/streams/`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!response.ok) {
		throw new Error("Erreur lors de la récupération du flux");
	}

	const blob = await response.blob();
	return URL.createObjectURL(blob);
};

// Hook optimisé pour la gestion du stream
const useVideoStream = () => {
	const [streamState, setStreamState] = useState<{
		url: string | null;
		error: string | null;
		isLoading: boolean;
	}>({
		url: null,
		error: null,
		isLoading: true,
	});

	useEffect(() => {
		let isMounted = true;
		let blobUrl: string | null = null;

		const loadStream = async () => {
			try {
				setStreamState(prev => ({ ...prev, isLoading: true }));
				const url = await fetchStreamUrl();
				blobUrl = url;

				if (isMounted) {
					setStreamState({
						url,
						error: null,
						isLoading: false,
					});
				}
			} catch (err) {
				if (isMounted) {
					setStreamState({
						url: null,
						error: err instanceof Error ? err.message : "Erreur inconnue",
						isLoading: false,
					});
				}
			}
		};

		loadStream();

		return () => {
			isMounted = false;
			if (blobUrl) {
				URL.revokeObjectURL(blobUrl);
			}
		};
	}, []); // Plus besoin de dépendances car on ne dépend plus de movieId

	return streamState;
};

// Composant vidéo avec gestion améliorée du buffering
const VideoPlayer: React.FC<{ url: string }> = ({ url }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [bufferingState, setBufferingState] = useState({
		isBuffering: true,
		progress: 0,
	});

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			const video = videoRef.current;
			if (video.buffered.length > 0) {
				const bufferedEnd = video.buffered.end(0);
				const duration = video.duration;
				const progress = (bufferedEnd / duration) * 100;

				setBufferingState({
					progress,
					isBuffering: progress < 100,
				});
			}
		}
	};

	const handleCanPlayThrough = () => {
		setBufferingState(prev => ({
			...prev,
			isBuffering: false,
		}));
	};

	return (
		<Box sx={{ position: "relative", width: "100%", height: "100%" }}>
			<video
				ref={videoRef}
				src={url}
				controls
				style={{ width: "100%", height: "100%", objectFit: "contain" }}
				onTimeUpdate={handleTimeUpdate}
				onWaiting={() => setBufferingState(prev => ({ ...prev, isBuffering: true }))}
				onCanPlayThrough={handleCanPlayThrough}
				preload="auto"
			/>

			{bufferingState.isBuffering && (
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						zIndex: 1,
						textAlign: "center",
						backgroundColor: "rgba(0,0,0,0.5)",
						padding: 2,
						borderRadius: 1,
					}}>
					<CircularProgress
						variant={bufferingState.progress > 0 ? "determinate" : "indeterminate"}
						value={bufferingState.progress}
						sx={{ color: "white" }}
					/>
					<Typography
						color="white"
						sx={{ mt: 1 }}>
						{bufferingState.progress > 0 ? `Chargement : ${Math.round(bufferingState.progress)}%` : "Chargement..."}
					</Typography>
				</Box>
			)}
		</Box>
	);
};

const MovieContent: React.FC<{ movie: Movie }> = ({ movie }) => {
	const theme = useTheme();

	return (
		<Card sx={{ width: "100%", height: "100%", borderRadius: 2, display: "flex", flexDirection: "column" }}>
			<Box sx={{ overflow: "auto", height: "100%" }}>
				{/* Titre centré avec plus d'espace */}
				<Box sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					py: 3,
					px: 2,
					borderBottom: 1,
					borderColor: "divider",
					backgroundColor: theme.palette.primary.main + "20",
				}}>
					<Typography
						variant="h5"
						component="h1"
						align="center"
						sx={{ 
							fontWeight: 'bold',
							color: theme.palette.text.primary
						}}>
						{movie.title}
					</Typography>
				</Box>
				{/* En-tête : Affiche + Infos principales */}
				<Box
					sx={{
						display: "flex",
						gap: 2,
						p: 2,
						borderBottom: 1,
						borderColor: "divider",
					}}>
					{/* Affiche */}
					<CardMedia
						component="img"
						sx={{
							width: 120,
							height: 180,
							objectFit: "contain",
							borderRadius: 1,
							backgroundColor: "black",
						}}
						image={movie.image ? `https://streamaccess-dev-backend.codevert.org/assets/movies_images/${movie.image}` : "/images/camera.png"}
						alt={`Affiche du film ${movie.title}`}
					/>

					{/* Informations principales */}
					<Box sx={{ flex: 1 }}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
							<Typography variant="body1">
								<strong>Année :</strong> {movie.releaseYear}
							</Typography>
							{movie.producerId && (
								<Typography variant="body1">
									<strong>Producteur :</strong> {movie.producerId}
								</Typography>
							)}
							{movie.directorId && (
								<Typography variant="body1">
									<strong>Réalisateur :</strong> {movie.directorId}
								</Typography>
							)}
							{movie.tags && movie.tags.length > 0 && (
								<Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 1 }}>
									{movie.tags.map((tag, index) => (
										<Chip
											key={index}
											label={tag}
											size="small"
											sx={{ backgroundColor: theme.palette.primary.main + "20" }}
										/>
									))}
								</Box>
							)}
						</Box>
					</Box>
				</Box>

				{/* Synopsis */}
				<Box sx={{ p: 2 }}>
					<Typography
						variant="h6"
						gutterBottom>
						Synopsis
					</Typography>
					<Typography
						variant="body1"
						paragraph
						sx={{ color: "text.secondary" }}>
						{movie.longSynopsis || "Aucun synopsis disponible."}
					</Typography>
				</Box>
			</Box>

			{/* Bouton Signaler fixe en bas */}
			<Box
				sx={{
					p: 2,
					borderTop: 1,
					borderColor: "divider",
					backgroundColor: theme.palette.background.paper,
					mt: "auto",
				}}>
				<Button
					variant="contained"
					color="secondary"
					fullWidth
					startIcon={<ReportProblemIcon />}>
					Signaler un problème
				</Button>
			</Box>
		</Card>
	);
};

const CommentSection: React.FC = () => {
    const [newComment, setNewComment] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [comments, setComments] = useState<Comment[]>(mockComments);
    const theme = useTheme();
    const { avatar } = useAvatar();
    const userName = useSelector((state: RootState) => state.user.name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        // Simulation d'un nouveau commentaire avec l'avatar de l'utilisateur
        const newCommentObject: Comment = {
            id: comments.length + 1,
            userId: 999,
            userName: userName || "Utilisateur",
            userAvatar: avatar || undefined,
            content: newComment,
            createdAt: new Date().toISOString(),
        };

        setComments(prevComments => [newCommentObject, ...prevComments]);
        setNewComment("");
        setIsExpanded(true);
    };

    return (
        <Box sx={{ 
            gridColumn: "span 2",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            overflow: 'hidden'
        }}>
            {/* En-tête cliquable */}
            <Box 
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{ 
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover
                    }
                }}
            >
                <Typography variant="h6">
                    Commentaires ({comments.length})
                </Typography>
                <IconButton size="small">
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>

            {/* Contenu déroulant */}
            <Collapse in={isExpanded}>
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider'
                }}>
                    {/* Formulaire nouveau commentaire - Déplacé en haut */}
                    <Box 
                        component="form" 
                        onSubmit={handleSubmit}
                        sx={{ 
                            display: 'flex', 
                            gap: 2,
                            alignItems: 'strecth',
                        }}
                    >
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Partagez votre avis..."
                            variant="outlined"
                            size="small"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!newComment.trim()}
                            startIcon={<SendIcon />}
                        >
                            Envoyer
                        </Button>
                    </Box>

                    {/* Liste des commentaires */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {comments.map(comment => (
                            <Box key={comment.id} sx={{ 
                                display: 'flex', 
                                gap: 2,
                                p: 2,
                                backgroundColor: theme.palette.background.default,
                                borderRadius: 1
                            }}>
                                <Avatar 
                                    src={comment.userAvatar}
                                    alt={comment.userName}
                                    sx={{ width: 40, height: 40 }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                            {comment.userName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2">
                                        {comment.content}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
};

const MoviePage = () => {
	const { id } = useParams<{ id: string }>();
	const { url: streamUrl, error: streamError, isLoading: streamLoading } = useVideoStream();

	const {
		data: movie,
		error,
		isLoading,
	} = useQuery<Movie, ApiError>(["movie", id], () => fetchMovieById(Number(id)), {
		enabled: !!id,
	});

	if (isLoading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}>
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
				}}>
				<Typography
					variant="h4"
					color="error">
					{error ? error.message : "Film non trouvé"}
				</Typography>
			</Box>
		);
	}

	return (
		<>
			<Navbar />
			<Box sx={{ display: "grid", gridTemplateColumns: "1fr 3fr", gridTemplateRows: "1fr auto", height: "92vh", width: "100%", padding: 3, gap: 2 }}>
				<MovieContent movie={movie} />

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
					}}>
					{streamLoading ? <CircularProgress sx={{ color: "white" }} /> : streamUrl ? <VideoPlayer url={streamUrl} /> : <Typography color="error">{streamError || "Erreur de chargement"}</Typography>}
				</Box>

				<CommentSection />
			</Box>
		</>
	);
};

export default MoviePage;
