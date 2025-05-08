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
		throw new Error(errorData.message || "Erreur lors de la suppression du film.");
	}
};

// Suppression d'un film
export const deleteMovie = async (id: number): Promise<void> => {
	const token = localStorage.getItem("accessToken") || "mockToken"; // Ajout d'une valeur par défaut
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`https://streamaccess-dev-backend.codevert.org/movies/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
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
	producerId: string;
	directorId: string;
	shortSynopsis: string;
	longSynopsis: string;
	teamComment: string;
}): Promise<void> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const imageInput = (document.querySelector('input[name="image"]') as HTMLInputElement).files?.[0];

	const formDataToSend = new FormData();
	formDataToSend.append("title", formData.title);
	formDataToSend.append("releaseYear", formData.releaseYear);
	if (imageInput) formDataToSend.append("image", (document.querySelector('input[name="image"]') as HTMLInputElement).files?.[0] || "");
	if (formData.producerId) {
		formDataToSend.append("producerId", formData.producerId);
	}
	if (formData.directorId) {
		formDataToSend.append("directorId", formData.directorId);
	}
	if (formData.shortSynopsis) formDataToSend.append("shortSynopsis", formData.shortSynopsis || "");
	if (formData.longSynopsis) formDataToSend.append("longSynopsis", formData.longSynopsis || "");
	if (formData.teamComment) formDataToSend.append("teamComment", formData.teamComment || "");

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

// Mise à jour d'un film
export const updateMovie = async (
	id: number,
	formData: {
		title?: string;
		releaseYear?: string;
		image?: File | null;
		producerId?: string;
		directorId?: string;
		longSynopsis?: string;
		shortSynopsis?: string;
		teamComment?: string;
	}
): Promise<void> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const formDataToSend = new FormData();
	if (formData.title) formDataToSend.append("title", formData.title);
	if (formData.releaseYear) formDataToSend.append("releaseYear", formData.releaseYear);
	if (formData.image) formDataToSend.append("image", formData.image);
	if (formData.producerId) formDataToSend.append("producerId", formData.producerId);
	if (formData.directorId) formDataToSend.append("directorId", formData.directorId);
	if (formData.longSynopsis) formDataToSend.append("longSynopsis", formData.longSynopsis);
	if (formData.shortSynopsis) formDataToSend.append("shortSynopsis", formData.shortSynopsis);
	if (formData.teamComment) formDataToSend.append("teamComment", formData.teamComment);

	const response = await fetch(`https://streamaccess-dev-backend.codevert.org/movies/${id}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formDataToSend,
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Erreur lors de la mise à jour du film.");
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

// Récupération de la liste des producteurs
export const fetchProducers = async (): Promise<{ id: number; name: string }[]> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const response = await fetch("https://streamaccess-dev-backend.codevert.org/movies/producers", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Erreur lors de la récupération des producteurs.");
	}

	return response.json();
};

// Récupération de la liste des réalisateurs
export const fetchDirectors = async (): Promise<{ id: number; name: string }[]> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const response = await fetch("https://streamaccess-dev-backend.codevert.org/movies/directors", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Erreur lors de la récupération des réalisateurs.");
	}

	return response.json();
};
