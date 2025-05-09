import { ApiError, Movie } from "../types/interfaces";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3100"; // Utilisation de la variable d'environnement

// Récupération des infos d'un film par ID
export const fetchMovieById = async (id: number): Promise<Movie> => {
	const token = localStorage.getItem("accessToken") || "mockToken"; // Ajout d'une valeur par défaut
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`${backendUrl}/movies/${id}`, {
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

	const response = await fetch(`${backendUrl}/streams/`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!response.ok) {
		throw new Error("Erreur lors de la récupération du flux");
	}

	const blob = await response.blob();
	return URL.createObjectURL(blob);
};

// Création d'un film
export const createMovie = async (formData: { title: string; description: string; releaseDate: string }): Promise<Movie> => {
	const token = localStorage.getItem("accessToken") || "mockToken"; // Ajout d'une valeur par défaut
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`${backendUrl}/movies`, {
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

	return response.json();
};

// Suppression d'un film
export const deleteMovie = async (id: number): Promise<void> => {
	const token = localStorage.getItem("accessToken") || "mockToken"; // Ajout d'une valeur par défaut
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`${backendUrl}/movies/${id}`, {
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
	image?: File | null;
}): Promise<Movie> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const formDataToSend = new FormData();
	formDataToSend.append("title", formData.title);
	formDataToSend.append("releaseYear", formData.releaseYear);
	if (formData.producerId) formDataToSend.append("producerId", formData.producerId);
	if (formData.directorId) formDataToSend.append("directorId", formData.directorId);
	if (formData.shortSynopsis) formDataToSend.append("shortSynopsis", formData.shortSynopsis);
	if (formData.longSynopsis) formDataToSend.append("longSynopsis", formData.longSynopsis);
	if (formData.teamComment) formDataToSend.append("teamComment", formData.teamComment);
	if (formData.image) formDataToSend.append("image", formData.image);

	const response = await fetch(`${backendUrl}/movies`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formDataToSend,
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || `Erreur : ${response.status} (${response.statusText})`);
	}

	return response.json(); // Retourne l'objet du film créé
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

	const response = await fetch(`${backendUrl}/movies/${id}`, {
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

// Mise à jour des tags d'un film
export const updateMovieTags = async (movieId: number, tagIds: number[]): Promise<void> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`${backendUrl}/movies/${movieId}/tags`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(tagIds), 
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Erreur lors de la mise à jour des tags du film.");
	}
};

// Récupération des tags associés à un film
export const fetchMovieTags = async (movieId: number): Promise<{ id: number; label: string }[]> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`${backendUrl}/movies/${movieId}/tags`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Erreur lors de la récupération des tags du film.");
	}

	return response.json();
};

// Inscription d'un utilisateur
export const registerUser = async (formData: { email: string; password: string; pseudo: string }): Promise<void> => {
	const response = await fetch(`${backendUrl}/auth/register`, {
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
	const response = await fetch(`${backendUrl}/auth/login`, {
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
	const response = await fetch(`${backendUrl}/users/me`, {
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

	const response = await fetch(`${backendUrl}/movies`, {
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

	const response = await fetch(`${backendUrl}/movies/producers`, {
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

	const response = await fetch(`${backendUrl}/movies/directors`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Erreur lors de la récupération des réalisateurs.");
	}

	return response.json();
};

// Création d'une personne (producteur ou réalisateur)
export const createPerson = async (name: string, role: "producer" | "director"): Promise<void> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const endpoint = role === "producer" ? "producer" : "director";

	const response = await fetch(`${backendUrl}/movies/${endpoint}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || `Erreur lors de la création du ${role}.`);
	}
};

// Suppression d'une personne (producteur ou réalisateur)
export const deletePerson = async (id: number, role: "producer" | "director"): Promise<void> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const endpoint = role === "producer" ? "producer" : "director";

	const response = await fetch(`${backendUrl}/movies/${endpoint}/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || `Erreur lors de la suppression du ${role}.`);
	}
};

// Mise à jour d'une personne (producteur ou réalisateur)
export const updatePerson = async (id: number, name: string, biography: string, role: "producer" | "director"): Promise<void> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const endpoint = role === "producer" ? "producer" : "director";

	const response = await fetch(`${backendUrl}/movies/${endpoint}/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name, biography }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || `Erreur lors de la mise à jour du ${role}.`);
	}
};

// Récupération de la liste des tags
export const fetchTags = async (): Promise<{ id: number; label: string }[]> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`${backendUrl}/movies/tags`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Erreur lors de la récupération des tags.");
	}

	return response.json();
};

// Création d'un tag
export const createTag = async (label: string): Promise<void> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`${backendUrl}/movies/tag`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ label }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Erreur lors de la création du tag.");
	}
};

// Suppression d'un tag
export const deleteTag = async (id: number): Promise<void> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`${backendUrl}/movies/tag/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Erreur lors de la suppression du tag.");
	}
};

// Mise à jour d'un tag
export const updateTag = async (id: number, label: string): Promise<void> => {
	const token = localStorage.getItem("accessToken");
	if (!token) throw new Error("Token manquant !");

	const response = await fetch(`${backendUrl}/movies/tag/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ label }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Erreur lors de la mise à jour du tag.");
	}
};
