import { useState } from "react";
import { Box, Typography, IconButton, Collapse, TextField, Button, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SendIcon from "@mui/icons-material/Send";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../providers/store";
import { addComment, selectComments } from "../../providers/store";
import { Comment } from "../../types/interfaces";
import { useAvatar } from "../../hooks/useAvatar";

const CommentSection: React.FC = () => {
	const [newComment, setNewComment] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);
	const theme = useTheme();
	const dispatch = useDispatch();
	const comments = useSelector(selectComments);
	const { avatar } = useAvatar();
	const userName = useSelector((state: RootState) => state.user.name);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		// Création d'un nouveau commentaire
		const newCommentObject: Comment = {
			id: Date.now(), // Utilisation de l'horodatage comme ID unique
			userId: 999,
			userName: userName || "Utilisateur",
			userAvatar: avatar || undefined,
			content: newComment,
			createdAt: new Date().toISOString(),
		};

		dispatch(addComment(newCommentObject)); // Ajout au store
		setNewComment("");
		setIsExpanded(true);
	};

	return (
		<Box sx={{ 
			gridColumn: "span 2",
			backgroundColor: theme.palette.background.paper,
			borderRadius: 2,
			overflow: "hidden"
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
					gap: 2,
					p: 2,
					borderTop: 1,
					borderColor: 'divider',
					maxHeight: "300px", // Limite la hauteur totale
					overflowY: "auto", // Ajoute un défilement si nécessaire
				}}>
					{/* Formulaire nouveau commentaire */}
					<Box 
						component="form" 
						onSubmit={handleSubmit}
						sx={{ 
							display: 'flex', 
							gap: 1,
							alignItems: 'center',
						}}
					>
						<TextField
							fullWidth
							multiline
							rows={1}
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Écrivez un commentaire..."
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
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
						{comments.map(comment => (
							<Box key={comment.id} sx={{ 
								display: 'flex', 
								gap: 1,
								p: 1,
								backgroundColor: theme.palette.background.default,
								borderRadius: 1
							}}>
								<Avatar 
									src={comment.userAvatar}
									alt={comment.userName}
									sx={{ width: 32, height: 32 }}
								/>
								<Box sx={{ flex: 1 }}>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
										<Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: "0.9rem" }}>
											{comment.userName}
										</Typography>
										<Typography variant="caption" color="text.secondary">
											{new Date(comment.createdAt).toLocaleDateString()}
										</Typography>
									</Box>
									<Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
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

export default CommentSection;
