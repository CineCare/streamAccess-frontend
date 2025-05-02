import { useSelector, useDispatch } from "react-redux";
import { RootState, fetchMovies, AppDispatch } from "../providers/store";

export const useMovies = () => {
	const dispatch = useDispatch<AppDispatch>();
	const movies = useSelector((state: RootState) => state.movies.list);

	const ensureMoviesLoaded = async (): Promise<void> => {
		if (movies.length === 0) {
			try {
				await dispatch(fetchMovies()).unwrap();
			} catch (error) {
				console.error("Erreur lors du chargement des films:", error);
				throw error;
			}
		}
	};

	return {
		movies,
		ensureMoviesLoaded,
		isLoading: movies.length === 0,
	};
};
