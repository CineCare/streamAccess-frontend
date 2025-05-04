import { useRef, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

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

export default VideoPlayer;
