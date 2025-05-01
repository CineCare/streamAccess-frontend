import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Card, CardContent, CardMedia, Button, TextField } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";

// Fonction pour récupérer les détails d'un film par son ID
const fetchMovieById = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Token manquant !"); // Vérifie si le token d'authentification est présent

    // Effectue une requête GET pour récupérer les informations du film
    const response = await fetch(`https://streamaccess-dev-backend.codevert.org/movies/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Ajoute le token d'authentification dans les en-têtes
        },
    });

    // Vérifie si la réponse est valide, sinon lève une erreur
    if (!response.ok) throw new Error(`Erreur : ${response.status} (${response.statusText})`);
    return response.json(); // Retourne les données du film au format JSON
};

// const fetchStreamByMovieId = async () => {
    // Désactivé temporairement car l'endpoint n'est pas encore opérationnel
    // const token = localStorage.getItem("accessToken");
    // if (!token) throw new Error("Token manquant !");
    // const response = await fetch(`https://streamaccess-dev-backend.codevert.org/streams`, {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //     },
    // });
    // if (!response.ok) {
    //     console.error(`Erreur HTTP : ${response.status} (${response.statusText})`);
    //     throw new Error(`Erreur : ${response.status} (${response.statusText})`);
    // }
    // const contentType = response.headers.get("Content-Type");
    // if (contentType && contentType.includes("application/json")) {
    //     return await response.json();
    // } else {
    //     return await response.text();
    // }
    // return null; // Retourne null pour indiquer qu'aucun flux n'est disponible
// };

const MoviePage = () => {
    const { id } = useParams<{ id: string }>();
    const [comment, setComment] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [streamUrl, setStreamUrl] = useState<string | null>(null);

    const { data: movie, error, isLoading } = useQuery(["movie", id], () => fetchMovieById(Number(id)), { enabled: !!id });

    useEffect(() => {
        const fetchStream = async () => {
            try {
                if (id) {
                    // Désactivé temporairement
                    // const streamData = await fetchStreamByMovieId();
                    // if (typeof streamData === "string") {
                    //     setStreamUrl(streamData);
                    // } else if (streamData && streamData.url) {
                    //     setStreamUrl(streamData.url);
                    // } else {
                    //     console.error("Le champ `url` est manquant ou la réponse est invalide :", streamData);
                    //     throw new Error("Le flux vidéo est introuvable.");
                    // }
                    console.warn("Le fetch du flux vidéo est désactivé temporairement.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du flux vidéo :", error);
            }
        };

        fetchStream();
    }, [id]);

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ padding: 3, textAlign: "center", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography
                    variant="h4"
                    color="error">{`Erreur : ${(error as Error).message}`}</Typography>
            </Box>
        );
    }

    return (
        <>
            <Navbar />

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 3fr", gridTemplateRows: "1fr auto", height: "92vh", width: "100%", padding: 3, gap: 2 }}>
                {/* Colonne de gauche - Affiche + Infos du film + Signalement */}
                <Card sx={{ width: "100%", height: "100%", borderRadius: 2, overflow: "auto" }}>
                    <CardMedia
                        component="img"
                        height="300"
                        image={movie.image ? `https://streamaccess-dev-backend.codevert.org/assets/movies_images/${movie.image}` : "/images/camera.png"}
                        alt={`Affiche du film ${movie.title}`}
                        sx={{ objectFit: "contain" }}
                    />
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {movie.title} ({movie.releaseYear})
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            <strong>Synopsis :</strong> {movie.longSynopsis || "Aucun synopsis disponible."}
                        </Typography>
                        <Button variant="contained" color="secondary" fullWidth>Signaler un problème</Button>
                    </CardContent>
                </Card>

                {/* Zone Vidéo */}
                <Box sx={{ width: "100%", height: "100%", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {streamUrl ? (
                        <video
                            src={streamUrl}
                            controls
                            style={{ width: "100%", height: "100%", borderRadius: 8 }}
                        >
                            Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                    ) : (
                        <Typography color="white">Chargement du lecteur vidéo...</Typography>
                    )}
                </Box>

                {/* Bande du bas - Commentaires */}
                <Box sx={{ gridColumn: "span 2", width: "100%", paddingTop: 2 }}>
                    <Typography variant="h5" gutterBottom>Laisser un commentaire</Typography>
                    <Box sx={{ display: "flex" }}>
                        <TextField fullWidth multiline rows={2} variant="outlined" placeholder="Écrivez votre commentaire ici..." value={comment} onChange={e => setComment(e.target.value)} />
                        <Button variant="contained" color="primary" sx={{ marginTop: 1 }}>Envoyer</Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default MoviePage;