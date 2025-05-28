import { useRef } from "react";
import { Box } from "@mui/material";

const VideoPlayer: React.FC<{ url: string }> = ({ url }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	// Ajout du token dans l'URL si besoin (si le backend l'accepte)
	const token = localStorage.getItem("accessToken");
	const videoUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url;

	return (
		<Box sx={{ position: "relative", width: "100%", height: "100%" }}>
			<video
				ref={videoRef}
				src={videoUrl}
				controls
				style={{ width: "100%", height: "100%", objectFit: "contain" }}
				preload="auto"
			/>
		</Box>
	);
};

export default VideoPlayer;
