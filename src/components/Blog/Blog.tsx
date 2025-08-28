import React, { useState } from "react";
import { mockBlogPosts } from "../../data/mockBlogPosts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BlogSidebar from "./BlogSidebar";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const Blog: React.FC = () => {
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const selectedPost = mockBlogPosts.find(p => p.id === selectedId) || null;

	return (
		<Box sx={{ flex: 1, width: "100%", height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.paper", borderRadius: 0, boxShadow: 0, p: { xs: 0, md: 0 } }}>
			<Typography
				variant="h1"
				component="h1"
				align="center"
				fontSize={40}
				fontWeight={900}
				mb={4}
				color="text.primary"
				sx={{ mt: 3 }}>
				LE BLOG DE L'ÉQUIPE
			</Typography>
			<Box sx={{ marginBottom: 2, flex: 1, display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, minHeight: 0, height: "100%" }}>
				{/* Sidebar */}
				<BlogSidebar
					posts={mockBlogPosts}
					onSelect={setSelectedId}
					selectedId={selectedId ?? undefined}
				/>
				{/* Main content */}
				<Box sx={{ flex: 1, minWidth: 0, height: "100%", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
					{selectedPost ? (
						<Paper
							elevation={3}
							sx={{ maxWidth: 800, width: "100%", mx: "auto", p: 0, borderRadius: 3, my: { xs: 2, md: 4 }, overflow: "hidden" }}>
							<Box sx={{ width: "100%", height: 200, bgcolor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
								<img
									src={selectedPost.image}
									alt={selectedPost.title}
									style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
									loading="lazy"
								/>
							</Box>
							<Box sx={{ p: { xs: 2, md: 4 } }}>
								<Typography
									variant="h2"
									component="h2"
									color="primary"
									textTransform="uppercase"
									fontWeight={700}
									fontSize={24}
									mb={1}>
									{selectedPost.title}
								</Typography>
								<Button
									onClick={() => setSelectedId(null)}
									sx={{ mb: 2, gap: 1 }}
									color="secondary"
									variant="text"
									startIcon={<ArrowBackIcon />}>
									Retour à la liste
								</Button>
								<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, mb: 2, color: "text.secondary", fontSize: 15 }}>
									<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
										<PersonIcon
											fontSize="small"
											sx={{ verticalAlign: "middle" }}
										/>
										<span>{selectedPost.author}</span>
									</Box>
									<Box sx={{ display: "flex", alignItems: "center", gap: 1}}>
										<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
											<CalendarTodayIcon
												fontSize="small"
												sx={{ verticalAlign: "middle" }}
											/>
											<span>{new Date(selectedPost.date).toLocaleDateString("fr-FR")}</span>
										</Box>
										<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
											<ChatBubbleOutlineIcon
												fontSize="small"
												sx={{ verticalAlign: "middle" }}
											/>
											<span>{selectedPost.commentsCount}</span>
										</Box>
									</Box>
								</Box>
								<Divider sx={{ mb: 2 }} />
								<Typography
									variant="body1"
									color="text.primary"
									sx={{ lineHeight: 1.7 }}>
									{selectedPost.content}
								</Typography>
							</Box>
						</Paper>
					) : (
						<Box sx={{ paddingRight: 2, width: "100%" }}>
							<Grid
								container
								spacing={3}>
								{mockBlogPosts.map(post => (
									<Grid
										size={3}
										key={post.id}>
										<Paper
											elevation={2}
											sx={{
												minHeight: 260,
												p: 0,
												borderRadius: 2,
												cursor: "pointer",
												display: "flex",
												flexDirection: "column",
												justifyContent: "flex-start",
												transition: "box-shadow 0.2s, transform 0.15s",
												"&:hover": { boxShadow: 6, transform: "translateY(-2px) scale(1.01)" },
												overflow: "hidden",
											}}
											tabIndex={0}
											onClick={() => setSelectedId(post.id)}
											role="button"
											aria-pressed="false"
											aria-labelledby={`post-title-${post.id}`}>
											<Box sx={{ width: "100%", height: 200, bgcolor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
												<img
													src={post.image}
													alt={post.title}
													style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
													loading="lazy"
												/>
											</Box>
											<Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
												<Typography
													id={`post-title-${post.id}`}
													variant="h6"
													color="primary"
													fontWeight={600}
													mb={0.5}
													textTransform="uppercase">
													{post.title}
												</Typography>
												<Box sx={{ display: "flex", flex: 1, justifyContent: "space-between", alignItems: "center", gap: 1, mb: 1, color: "text.secondary", fontSize: 14 }}>
													<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
														<PersonIcon
															fontSize="small"
															sx={{ verticalAlign: "middle" }}
														/>
														<span>{post.author}</span>
													</Box>
													<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
														<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
															<CalendarTodayIcon
																fontSize="small"
																sx={{ verticalAlign: "middle" }}
															/>
															<span>{new Date(post.date).toLocaleDateString("fr-FR")}</span>
														</Box>
														<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
															<ChatBubbleOutlineIcon
																fontSize="small"
																sx={{ verticalAlign: "middle" }}
															/>
															<span>{post.commentsCount}</span>
														</Box>
													</Box>
												</Box>

												<Typography
													variant="body2"
													color="text.primary"
													sx={{
														display: "-webkit-box",
														WebkitLineClamp: 3,
														WebkitBoxOrient: "vertical",
														overflow: "hidden",
														textOverflow: "ellipsis",
													}}>
													{post.excerpt}
												</Typography>
											</Box>
										</Paper>
									</Grid>
								))}
							</Grid>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default Blog;
