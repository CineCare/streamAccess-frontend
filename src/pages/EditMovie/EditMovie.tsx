import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid
} from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import {
  fetchMovieById,
  updateMovie,
  fetchProducers,
  fetchDirectors,
  fetchTags,
  updateMovieTags,
  fetchMovieTags
} from "../../services/FetcherService";
import { Movie } from "../../types/interfaces";
import MovieIcon from "@mui/icons-material/Movie";
import TheatersIcon from "@mui/icons-material/Theaters";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import ChatIcon from "@mui/icons-material/Chat";
import ShortTextIcon from "@mui/icons-material/ShortText";
import NotesIcon from "@mui/icons-material/Notes";

const EditMovie: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: "",
    releaseYear: "",
    image: null as File | null,
    producerId: "",
    directorId: "",
    shortSynopsis: "",
    longSynopsis: "",
    teamComment: "",
    history: ""
  });
  const [producers, setProducers] = useState<{ id: number; name: string }[]>([]);
  const [directors, setDirectors] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; label: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [movie, producersList, directorsList, tagsList, movieTags] = await Promise.all([
          fetchMovieById(Number(id)),
          fetchProducers(),
          fetchDirectors(),
          fetchTags(),
          fetchMovieTags(Number(id))
        ]);

        setFormData({
          title: movie.title || "",
          releaseYear: movie.releaseYear?.toString() || "",
          image: null,
          producerId: movie.producerId?.toString() || "",
          directorId: movie.directorId?.toString() || "",
          shortSynopsis: movie.shortSynopsis || "",
          longSynopsis: movie.longSynopsis || "",
          teamComment: movie.teamComment || "",
          history: movie.history || ""
        });
        setProducers(producersList);
        setDirectors(directorsList);
        setTags(tagsList);
        setSelectedTags(movieTags.map(tag => tag.label));
        setMovie(movie);
      } catch {
        setError("Erreur lors du chargement des données.");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    let objectUrl: string | undefined;
    if (formData.image) {
      objectUrl = URL.createObjectURL(formData.image);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [formData.image]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name!]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleTagChange = (e: SelectChangeEvent<string[]>) => {
    setSelectedTags(e.target.value as string[]);
  };

  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await updateMovie(Number(id), formData);
      if (selectedTags.length > 0) {
        await updateMovieTags(Number(id), selectedTags.map(tag => tags.find(t => t.label === tag)?.id || 0));
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><CircularProgress /></Box>;
  }

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4, margin: "0 auto", display: "flex", flexDirection: "column", height: "auto" }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <MovieIcon sx={{ mr: 1 }} />
              <Typography variant="h6" gutterBottom>Infos générales</Typography>
            </Box>
            <TextField fullWidth label="Titre du film" name="title" value={formData.title} onChange={handleTextFieldChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Année de sortie" name="releaseYear" value={formData.releaseYear} onChange={handleTextFieldChange} type="number" sx={{ mb: 2 }} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TheatersIcon sx={{ mr: 1 }} />
              <Typography variant="h6" gutterBottom>Équipe de production</Typography>
            </Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Producteur</InputLabel>
              <Select name="producerId" value={formData.producerId} onChange={handleSelectChange} label="Producteur">
                {producers.map(p => <MenuItem key={p.id} value={p.id.toString()}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Réalisateur</InputLabel>
              <Select name="directorId" value={formData.directorId} onChange={handleSelectChange} label="Réalisateur">
                {directors.map(d => <MenuItem key={d.id} value={d.id.toString()}>{d.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocalOfferIcon sx={{ mr: 1 }} />
              <Typography variant="h6" gutterBottom>Tags</Typography>
            </Box>
            <FormControl fullWidth>
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={selectedTags}
                onChange={handleTagChange}
                renderValue={selected => selected.join(", ")}
              >
                {tags.map(tag => <MenuItem key={tag.id} value={tag.label}>{tag.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PermMediaIcon sx={{ mr: 1 }} />
              <Typography variant="h6" gutterBottom>Jaquette</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ flexGrow: 2 }}>
                <Button variant="outlined" component="label" sx={{ mb: 1 }}>Choisir une image<input type="file" hidden accept="image/*" onChange={handleFileChange} /></Button>
                <Typography variant="body2">{formData.image?.name || "Aucune image sélectionnée"}</Typography>
              </Box>
              <Box component="img" src={formData.image ? URL.createObjectURL(formData.image) : (movie?.image ? `${import.meta.env.VITE_BACKEND_URL}/assets/movies_images/${movie.image}` : "/images/camera.png")} sx={{ height: 200, objectFit: "contain", mt: 2, flexGrow: 1 }} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <InfoOutlineIcon sx={{ mr: 1 }} />
              <Typography variant="h6" gutterBottom>Histoire / Anecdote</Typography>
            </Box>
            <TextField fullWidth multiline rows={6} name="history" value={formData.history} onChange={handleTextFieldChange} variant="outlined" />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <ChatIcon sx={{ mr: 1 }} />
              <Typography variant="h6" gutterBottom>Commentaire de l'équipe</Typography>
            </Box>
            <TextField fullWidth multiline rows={6} name="teamComment" value={formData.teamComment} onChange={handleTextFieldChange} variant="outlined" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <ShortTextIcon sx={{ mr: 1 }} />
              <Typography variant="h6" gutterBottom>Synopsis court</Typography>
            </Box>
            <TextField fullWidth multiline rows={6} name="shortSynopsis" value={formData.shortSynopsis} onChange={handleTextFieldChange} variant="outlined" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <NotesIcon sx={{ mr: 1 }} />
              <Typography variant="h6" gutterBottom>Synopsis long</Typography>
            </Box>
            <TextField fullWidth multiline rows={6} name="longSynopsis" value={formData.longSynopsis} onChange={handleTextFieldChange} variant="outlined" />
          </Grid>

          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Button variant="contained" color="success" onClick={handleSave} disabled={loading} sx={{ px: 6 }}>
              {loading ? <CircularProgress size={24} /> : "Sauvegarder"}
            </Button>
            {success && <Typography color="success.main" sx={{ mt: 2 }}>Le film a été mis à jour avec succès !</Typography>}
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default EditMovie;
