import { useState, useEffect } from "react";
import { fetchStreamUrl } from "../services/FetcherService";

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
	}, []);

	return streamState;
};

export default useVideoStream;
