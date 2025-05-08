import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, fetchMovies } from "../providers/store";

const useFetchMovies = () => {
	// Hook personnalisé pour charger les films
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(fetchMovies()); // Charge les films dans le store
	}, [dispatch]);
};

export default useFetchMovies;
