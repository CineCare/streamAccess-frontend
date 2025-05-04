import { ApiError, Movie } from "../types/interfaces";

// Récupération des infos d'un film par ID
export const fetchMovieById = async (id: number): Promise<Movie> => {
	const token = localStorage.getItem("accessToken") || "mockToken"; // Ajout d'une valeur par défaut
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

// Récupération de l'URL du flux vidéo
export const fetchStreamUrl = async (): Promise<string> => {
	const token = localStorage.getItem("accessToken") || "mockToken"; // Ajout d'une valeur par défaut
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

// Création d'un film
export const createMovie = async (formData: { title: string; description: string; releaseDate: string }): Promise<void> => {
	const token = localStorage.getItem("accessToken") || "mockToken"; // Ajout d'une valeur par défaut
	if (!token) throw new Error("Token manquant !");

	const response = await fetch("https://streamaccess-dev-backend.codevert.org/movies", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(formData),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Erreur lors de la création du film.");
	}
};

// Création d'un film avec une image
export const createMovieWithImage = async (formData: {
	title: string;
	releaseYear: string;
	image: string;
	producerId: string;
	directorId: string;
	shortSynopsis: string;
	longSynopsis: string;
	teamComment: string;
}): Promise<void> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const formDataToSend = new FormData();
	formDataToSend.append("title", formData.title);
	formDataToSend.append("releaseYear", formData.releaseYear);
	formDataToSend.append("image", (document.querySelector('input[name="image"]') as HTMLInputElement).files?.[0] || "");
	if (formData.producerId) {
		formDataToSend.append("producerId", formData.producerId);
	}
	if (formData.directorId) {
		formDataToSend.append("directorId", formData.directorId);
	}
	formDataToSend.append("shortSynopsis", formData.shortSynopsis || "");
	formDataToSend.append("longSynopsis", formData.longSynopsis || "");
	formDataToSend.append("teamComment", formData.teamComment || "");

	const response = await fetch("https://streamaccess-dev-backend.codevert.org/movies", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formDataToSend,
	});

	if (!response.ok) {
		throw new Error(`Erreur : ${response.status} (${response.statusText})`);
	}
};

// Inscription d'un utilisateur
export const registerUser = async (formData: { email: string; password: string; pseudo: string }): Promise<void> => {
	const response = await fetch("https://streamaccess-dev-backend.codevert.org/auth/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(formData),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Erreur lors de l'inscription.");
	}
};

// Authentification d'un utilisateur
export const authenticateUser = async (email: string, password: string): Promise<string> => {
	const response = await fetch("https://streamaccess-dev-backend.codevert.org/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Erreur lors de la connexion.");
	}

	const data = await response.json();
	return data.accessToken;
};

// Récupération des informations utilisateur
export const fetchUserInfo = async (accessToken: string): Promise<{ pseudo: string; email: string }> => {
	const response = await fetch("https://streamaccess-dev-backend.codevert.org/users/me", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error("Erreur lors de la récupération des données utilisateur.");
	}

	return response.json();
};

// Récupération de tous les films
export const fetchAllMovies = async (): Promise<Movie[]> => {
	const token = localStorage.getItem("accessToken") || "mockToken"; // Ajout d'une valeur par défaut
	if (!token) throw new Error("Token manquant !");

	const response = await fetch("https://streamaccess-dev-backend.codevert.org/movies", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Erreur : ${response.status} (${response.statusText})`);
	}

	return response.json();
};
