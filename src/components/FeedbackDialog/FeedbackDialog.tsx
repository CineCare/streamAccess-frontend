import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, Rating, Alert,
  Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, FormLabel, FormControl, Chip,
  Divider, Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { styled } from '@mui/material/styles';
import type { IconContainerProps } from '@mui/material/Rating';
import { FeedbackData, FeedbackDialogProps } from '../../types/interfaces';

const initialState: FeedbackData = {
  // 1) Repères factuels
  titre: '',
  realisation: '',
  pays: '',
  annee: '',
  duree: '',
  langues: '',
  // 2) Contexte de visionnement
  moment: '',
  momentAutre: '',
  dispositif: [] as string[],
  audio: [] as string[],
  aides: [] as string[],
  aidesAutre: '',
  presence: '',
  interactions: '',
  // 3) Prise en main et accessibilité
  trouverFilm: 3,
  activerAides: 3,
  obstacles: [] as string[],
  obstaclesAutre: '',
  probleme: '',
  // 4) Parcours sensoriel
  audioSensoriel: '',
  lumiere: '',
  mouvements: '',
  autresFacteurs: '',
  ceQuiMaAide: '',
  // 5) Ressenti immédiat & réflexivité
  ressenti: '',
  ceQuiMeReste: '',
  suivreHistoire: '',
  pourquoi: '',
  conscienceFiltres: 3,
  aspectsInfluence: '',
  // 6) Réception située
  ceQueCeFilmMaFait: '',
  ceQueJaimerais: '',
  ceQueJeVeuxGarder: '',
  silenceCommeReponse: false,
  silencePourquoi: '',
  dessin: null,
  audioFichier: null,
  // 7) Charge cognitive, sensorielle et aisance perçue
  chargeCognitive: 3,
  aisance: 3,
  aidesMieuxSoutenu: '',
  // 8) Mots-clés
  motsCles: [] as string[],
  motsPerso: '',
  // 9) Transversalité
  autresContenus: '',
  influenceReception: '',
  autresUsages: '',
  // 10) Consentement
  anonyme: false,
  autorisation: false,
  contact: '',
};

const motsClesList = [
  // Sensoriel / Formel
  "image claire", "image confuse", "Contraste marqué", "Saturation colorée", "Douceur visuelle",
  "Mouvements fluides", "Mouvements brusques", "Silence marqué", "Densité sonore", "Enveloppement sonore",
  "Spatialité vaste", "Confinement - huis clos",
  // Emotionnel
  "Apaisement", "Tension", "Curiosité", "Malaise", "Joie", "Tristesse", "Colère", "Nostalgie", "Surprise", "Émerveillement",
  // Corporel
  "Frisson", "Détente", "Oppression", "Chaleur", "Froid", "Fatigue", "Énergie",
  // Relationnel / Narratif
  "Proximité avec un personnage", "Distance / détachement", "Immersion", "Perplexité", "Identification", "Exclusion ressentie", "Anxiété", "Paranoïa"
];

const ratingLabels: { [index: number]: string } = {
  1: "Très faible",
  2: "Assez faible",
  3: "Moyen",
  4: "Assez élevé",
  5: "Très élevé",
};

const ratingLabelsEasy: { [index: number]: string } = {
  1: "Très difficile",
  2: "Assez difficile",
  3: "Moyen",
  4: "Assez facile",
  5: "Très facile",
};

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const customIcons: {
  [index: number]: {
    icon: React.ReactElement;
    label: string;
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: 'Très mal',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: 'Plutôt mal',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: 'Mitigé(e)',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: 'Plutôt bien',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: 'Très bien',
  },
};

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value as number].icon}</span>;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ open, onClose }) => {
  const [data, setData] = useState<FeedbackData>(initialState);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState<{ [key: string]: number }>({});
  const theme = useTheme();

  // Style dynamique selon le thème
  const sectionStyle = {
    p: 3,
    mb: 1,
    background: theme.palette.background.paper,
    borderRadius: 2,
    boxShadow: theme.shadows[1],
  };

  // Typage strict pour les handlers
  const handleChange = <K extends keyof FeedbackData>(field: K, value: FeedbackData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = <K extends keyof FeedbackData>(field: K, value: string) => {
    setData(prev => {
      const arr = prev[field];
      if (Array.isArray(arr)) {
        return {
          ...prev,
          [field]: arr.includes(value)
            ? arr.filter((v: string) => v !== value)
            : [...arr, value],
        };
      }
      return prev;
    });
  };

  // Ajoute un handler pour les fichiers
  const handleFileChange = (field: 'dessin' | 'audioFichier', file: File | null) => {
    setData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    setSending(true);
    setError(null);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3100";
      const formData = new FormData();
      // Ajoute tous les champs sauf les fichiers
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'dessin' || key === 'audioFichier') return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value ?? '');
        }
      });
      // Ajoute les fichiers s'ils existent
      if (data.dessin) formData.append('dessin', data.dessin);
      if (data.audioFichier) formData.append('audioFichier', data.audioFichier);
      formData.append('to', 'cinecare6@gmail.com');
      // formData.append('to', 'lokkotarakun@gmail.com');

      const res = await fetch(`${backendUrl}/send-feedback`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Erreur lors de l\'envoi');
      setSent(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setSent(false);
    setData(initialState);
    setError(null);
    onClose();
  };

  const resetForm = () => {
    setData(initialState);
    setError(null);
  };

  const handleCloseDialog = () => {
    setSent(false);
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 0.5,
          bgcolor: theme.palette.primary.main,
        }}
      >
        Fiche de réception spectatorielle sensible et située
      </DialogTitle>
      <DialogContent sx={{ bgcolor: theme.palette.background.default }}>
        {sent ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Merci pour votre retour ! Votre message a bien été envoyé à l'équipe.
          </Alert>
        ) : (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* 1) Repères factuels */}
            <Paper elevation={0} sx={sectionStyle}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase', color: theme.palette.primary.light }}>
                1. Repères factuels
              </Typography>
              <TextField label="Titre (VO / VF)" value={data.titre} onChange={e => handleChange('titre', e.target.value)} fullWidth sx={{ mb: 2 }} />
              <TextField label="Réalisation" value={data.realisation} onChange={e => handleChange('realisation', e.target.value)} fullWidth sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Pays"
                  value={data.pays}
                  onChange={e => handleChange('pays', e.target.value)}
                  sx={{ flex: 2 }}
                />
                <TextField
                  label="Année"
                  type="date"
                  value={data.annee}
                  onChange={e => handleChange('annee', e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Durée (min)"
                  type="number"
                  value={data.duree}
                  onChange={e => handleChange('duree', e.target.value)}
                  sx={{ flex: 1 }}
                />
              </Box>
              <TextField label="Langues audio / Sous-titres disponibles" value={data.langues} onChange={e => handleChange('langues', e.target.value)} fullWidth />
            </Paper>
            <Divider />

            {/* 2) Contexte de visionnement */}
            <Paper elevation={0} sx={sectionStyle}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase', color: theme.palette.primary.light }}>
                2. Contexte de visionnement
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color:theme.palette.secondary.main }}>
                Moment de réponse
              </Typography>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel sx={{ display: "none" }}>Moment de réponse</FormLabel>
                <RadioGroup row value={data.moment} onChange={e => handleChange('moment', e.target.value)}>
                  <FormControlLabel value="immediat" control={<Radio />} label="Immédiat" />
                  <FormControlLabel value="24h" control={<Radio />} label="+24 heures" />
                  <FormControlLabel value="autre" control={<Radio />} label="Autre" />
                </RadioGroup>
                {data.moment === "autre" && (
                  <TextField label="Précisez" value={data.momentAutre} onChange={e => handleChange('momentAutre', e.target.value)} size="small" sx={{ mt: 1 }} />
                )}
              </FormControl>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color:theme.palette.secondary.main }}>
                Support utilisé
              </Typography>
              <FormGroup row sx={{ mb: 2 }}>
                {["Smartphone", "Tablette", "Ordinateur", "Téléviseur"].map(opt => (
                  <FormControlLabel
                    key={opt}
                    control={<Checkbox checked={data.dispositif.includes(opt)} onChange={() => handleArrayChange('dispositif', opt)} />}
                    label={opt}
                  />
                ))}
              </FormGroup>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color:theme.palette.secondary.main }}>
                Audio
              </Typography>
              <FormGroup row sx={{ mb: 2 }}>
                {["Casque / écouteurs", "Haut-parleurs"].map(opt => (
                  <FormControlLabel
                    key={opt}
                    control={<Checkbox checked={data.audio.includes(opt)} onChange={() => handleArrayChange('audio', opt)} />}
                    label={opt}
                  />
                ))}
              </FormGroup>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color:theme.palette.secondary.main }}>
                Technologies / aides utilisées
              </Typography>
              <FormGroup row sx={{ mb: 2 }}>
                {["Sous-titres standard (ST)", "Sous-titres sourds et malentendants (SDH)", "Audiodescription (AD)", "Lecteur d’écran", "Navigation clavier", "Loupe", "Dictée vocale", "Autre"].map(opt => (
                  <FormControlLabel
                    key={opt}
                    control={<Checkbox checked={data.aides.includes(opt)} onChange={() => handleArrayChange('aides', opt)} />}
                    label={opt}
                  />
                ))}
                {data.aides.includes("Autre") && (
                  <TextField
                    label="Précisez"
                    value={data.aidesAutre}
                    onChange={e => handleChange('aidesAutre', e.target.value)}
                    size="small"
                    sx={{ ml: 2 }}
                  />
                )}
              </FormGroup>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color:theme.palette.secondary.main }}>
                Présence d'autres spectateur·ices
              </Typography>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel sx={{ display: "none" }}>Présence d’autres spectateurices</FormLabel>
                <RadioGroup row value={data.presence} onChange={e => handleChange('presence', e.target.value)}>
                  <FormControlLabel value="seul" control={<Radio />} label="Seul(e)x" />
                  <FormControlLabel value="groupe" control={<Radio />} label="En groupe (amis, famille)" />
                </RadioGroup>
              </FormControl>
              <TextField label="Interactions collectives éventuelles" value={data.interactions} onChange={e => handleChange('interactions', e.target.value)} fullWidth />
            </Paper>
            <Divider />

            {/* 3) Prise en main et accessibilité en ligne */}
            <Paper elevation={0} sx={sectionStyle}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.light, textTransform: 'uppercase' }}>
                3. Prise en main et accessibilité en ligne
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: theme.palette.secondary.main }}>
                Trouver et lancer le film
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormLabel sx={{ minWidth: 180, display: "none" }}>Trouver et lancer le film</FormLabel>
                <Rating
                  max={5}
                  value={data.trouverFilm}
                  onChange={(_, v) => handleChange('trouverFilm', v || 1)}
                  onChangeActive={(_, v) => setHover(h => ({ ...h, trouverFilm: v ?? -1 }))}
                  icon={<MovieCreationIcon sx={{ color: theme.palette.info.main }} />}
                  emptyIcon={<MovieCreationIcon sx={{ color: theme.palette.action.disabled }} />}
                  sx={{ verticalAlign: 'middle' }}
                />
                <Typography variant="body2" sx={{ ml: 2, minWidth: 110 }}>
                  {ratingLabelsEasy[hover.trouverFilm !== undefined && hover.trouverFilm !== -1 ? hover.trouverFilm : data.trouverFilm || 1]}
                </Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: theme.palette.secondary.main }}>
                Activer / régler les aides (ST, SDH, AD)
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormLabel sx={{ minWidth: 180, display: "none" }}>Activer / régler les aides (ST, SDH, AD)</FormLabel>
                <Rating
                  max={5}
                  value={data.activerAides}
                  onChange={(_, v) => handleChange('activerAides', v || 1)}
                  onChangeActive={(_, v) => setHover(h => ({ ...h, activerAides: v ?? -1 }))}
                  icon={<MovieCreationIcon sx={{ color: theme.palette.info.main }} />}
                  emptyIcon={<MovieCreationIcon sx={{ color: theme.palette.action.disabled }} />}
                  sx={{ verticalAlign: 'middle' }}
                />
                <Typography variant="body2" sx={{ ml: 2, minWidth: 110 }}>
                  {ratingLabelsEasy[hover.activerAides !== undefined && hover.activerAides !== -1 ? hover.activerAides : data.activerAides || 1]}
                </Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: theme.palette.secondary.main }}>
                Obstacles ou manques constatés
              </Typography>
              <FormGroup row sx={{ mb: 2 }}>
                { [
                  "Texte trop petit",
                  "SDH absents ou inadaptés",
                  "Audiodescription absente ou indisponible",
                  "Aides difficiles à trouver ou à changer",
                  "Absence d’options pour réduire animations",
                  "Contraste insuffisant / thème sombre manquant",
                  "Autre"
                ].map(opt => (
                  <FormControlLabel
                    key={opt}
                    control={
                      <Checkbox
                        checked={data.obstacles.includes(opt)}
                        onChange={() => handleArrayChange('obstacles', opt)}
                      />
                    }
                    label={opt}
                  />
                ))}
                {data.obstacles.includes("Autre") && (
                  <TextField
                    label="Précisez"
                    value={data.obstaclesAutre}
                    onChange={e => handleChange('obstaclesAutre', e.target.value)}
                    size="small"
                    sx={{ ml: 2, minWidth: 200 }}
                  />
                )}
              </FormGroup>
              <TextField label="Problème à signaler (libre)" value={data.probleme} onChange={e => handleChange('probleme', e.target.value)} fullWidth />
            </Paper>
            <Divider />

            {/* 4) Parcours sensoriel */}
            <Paper elevation={0} sx={sectionStyle}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.light, textTransform: 'uppercase' }}>
                4. Parcours sensoriel
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: theme.palette.secondary.main }}>
                Audio
              </Typography>
              <FormGroup row sx={{ mb: 2 }}>
                {["Non pertinent / non utilisé", "OK", "Gênant (sons trop forts, aigus, vibrations, bruits soudains)"].map(opt => (
                  <FormControlLabel
                    key={opt}
                    control={<Radio checked={data.audioSensoriel === opt} onChange={() => handleChange('audioSensoriel', opt)} />}
                    label={opt}
                  />
                ))}
              </FormGroup>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: theme.palette.secondary.main }}>
                Lumière et contraste
              </Typography>
              <FormGroup row sx={{ mb: 2 }}>
                {["OK", "Gênant (clignotements, éblouissements)", "Non pertinent"].map(opt => (
                  <FormControlLabel
                    key={opt}
                    control={<Radio checked={data.lumiere === opt} onChange={() => handleChange('lumiere', opt)} />}
                    label={opt}
                  />
                ))}
              </FormGroup>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: theme.palette.secondary.main }}>
                Mouvements et animations
              </Typography>
              <FormGroup row sx={{ mb: 2 }}>
                {["OK", "Gênant", "J’aimerais réduire ces effets"].map(opt => (
                  <FormControlLabel
                    key={opt}
                    control={<Radio checked={data.mouvements === opt} onChange={() => handleChange('mouvements', opt)} />}
                    label={opt}
                  />
                ))}
              </FormGroup>
              <TextField label="Autres facteurs sensoriels (température, confort physique…)" value={data.autresFacteurs} onChange={e => handleChange('autresFacteurs', e.target.value)} fullWidth sx={{ mb: 2 }} />
              <TextField label="Ce qui m’a aidé(e) sensoriellement" value={data.ceQuiMaAide} onChange={e => handleChange('ceQuiMaAide', e.target.value)} fullWidth />
            </Paper>
            <Divider />

            {/* 5) Ressenti immédiat & réflexivité */}
            <Paper elevation={0} sx={sectionStyle}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.light, textTransform: 'uppercase' }}>
                5. Ressenti immédiat & réflexivité
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: theme.palette.secondary.main }}>
                Maintenant, je me sens
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <StyledRating
                  max={5}
                  value={
                    data.ressenti === "Très bien" ? 5 :
                    data.ressenti === "Plutôt bien" ? 4 :
                    data.ressenti === "Mitigé(e)" ? 3 :
                    data.ressenti === "Plutôt mal" ? 2 :
                    data.ressenti === "Très mal" ? 1 : 0
                  }
                  onChange={(_, v) => {
                    const map = {
                      1: "Très mal",
                      2: "Plutôt mal",
                      3: "Mitigé(e)",
                      4: "Plutôt bien",
                      5: "Très bien"
                    } as const;
                    handleChange('ressenti', v ? map[v as 1|2|3|4|5] : "");
                  }}
                  IconContainerComponent={IconContainer}
                  getLabelText={(value: number) => customIcons[value].label}
                  highlightSelectedOnly
                />
                <Typography variant="body2" sx={{ ml: 2, minWidth: 90 }}>
                  {customIcons[
                    data.ressenti === "Très bien" ? 5 :
                    data.ressenti === "Plutôt bien" ? 4 :
                    data.ressenti === "Mitigé(e)" ? 3 :
                    data.ressenti === "Plutôt mal" ? 2 :
                    data.ressenti === "Très mal" ? 1 : 0
                  ]?.label || ""}
                </Typography>
              </Box>
              <TextField label="Ce qui me reste (image, son, idée, sensation, émotion…)" value={data.ceQuiMeReste} onChange={e => handleChange('ceQuiMeReste', e.target.value)} fullWidth sx={{ mb: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: theme.palette.secondary.main }}>
                Suivre l'histoire, pour moi, c'était
              </Typography>
              <FormGroup row sx={{ mb: 2 }}>
                {["Facile", "Parfois difficile", "Souvent difficile", "Je choisis le silence / non pertinent"].map(opt => (
                  <FormControlLabel
                    key={opt}
                    control={<Radio checked={data.suivreHistoire === opt} onChange={() => handleChange('suivreHistoire', opt)} />}
                    label={opt}
                  />
                ))}
              </FormGroup>
              <TextField label="Pourquoi ?" value={data.pourquoi} onChange={e => handleChange('pourquoi', e.target.value)} fullWidth sx={{ mb: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: theme.palette.secondary.main }}>
                Conscience de mes filtres
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormLabel sx={{ minWidth: 180, display: "none" }}>Conscience de mes filtres (attentes, humeur, expériences passées)</FormLabel>
                <Rating
                  max={5}
                  value={data.conscienceFiltres}
                  onChange={(_, v) => handleChange('conscienceFiltres', v || 1)}
                  onChangeActive={(_, v) => setHover(h => ({ ...h, conscienceFiltres: v ?? -1 }))}
                  icon={<MovieCreationIcon sx={{ color: theme.palette.info.main }} />}
                  emptyIcon={<MovieCreationIcon sx={{ color: theme.palette.action.disabled }} />}
                  sx={{ verticalAlign: 'middle' }}
                />
                <Typography variant="body2" sx={{ ml: 2, minWidth: 90 }}>
                  {ratingLabels[hover.conscienceFiltres !== undefined && hover.conscienceFiltres !== -1 ? hover.conscienceFiltres : data.conscienceFiltres || 1]}
                </Typography>
              </Box>
              <TextField label="Aspects qui ont le plus influencé ma réception" value={data.aspectsInfluence} onChange={e => handleChange('aspectsInfluence', e.target.value)} fullWidth />
            </Paper>
            <Divider />

            {/* 6) Réception située */}
            <Paper elevation={0} sx={sectionStyle}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.light, textTransform: 'uppercase' }}>
                6. Réception située (expression libre et multimodale)
              </Typography>
              <TextField label="Ce que ce film m’a fait…" value={data.ceQueCeFilmMaFait} onChange={e => handleChange('ceQueCeFilmMaFait', e.target.value)} fullWidth sx={{ mb: 2 }} />
              <TextField label="Ce que j’aurais aimé…" value={data.ceQueJaimerais} onChange={e => handleChange('ceQueJaimerais', e.target.value)} fullWidth sx={{ mb: 2 }} />
              <TextField label="Ce que je veux garder…" value={data.ceQueJeVeuxGarder} onChange={e => handleChange('ceQueJeVeuxGarder', e.target.value)} fullWidth sx={{ mb: 2 }} />
              <FormControlLabel
                control={<Checkbox checked={data.silenceCommeReponse} onChange={e => handleChange('silenceCommeReponse', e.target.checked)} />}
                label="Je choisis le silence comme réponse (facultatif : pourquoi ?)"
              />
              {data.silenceCommeReponse && (
                <TextField label="Pourquoi ?" value={data.silencePourquoi} onChange={e => handleChange('silencePourquoi', e.target.value)} fullWidth sx={{ mt: 1 }} />
              )}
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, mt: 2, color: theme.palette.secondary.main }}>
                Pièces jointes
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ flex: 1 }}
                >
                  Dessin (image)
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange('dessin', file);
                    }}
                  />
                </Button>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {data.dessin ? data.dessin.name : ''}
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ flex: 1 }}
                >
                  Musique / Audio
                  <input
                    type="file"
                    accept="audio/*"
                    hidden
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange('audioFichier', file);
                    }}
                  />
                </Button>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {data.audioFichier ? data.audioFichier.name : ''}
                </Typography>
              </Box>
            </Paper>
            <Divider />

            {/* 7) Charge cognitive, sensorielle et aisance perçue */}
            <Paper elevation={0} sx={sectionStyle}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.light, textTransform: 'uppercase' }}>
                7. Charge cognitive, sensorielle et aisance perçue
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: theme.palette.secondary.main }}>
                Charge cognitive ou sensorielle pendant la séance
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormLabel sx={{ minWidth: 180, display: "none" }}>Charge cognitive ou sensorielle pendant la séance</FormLabel>
                <Rating
                  max={5}
                  value={data.chargeCognitive}
                  onChange={(_, v) => handleChange('chargeCognitive', v || 1)}
                  onChangeActive={(_, v) => setHover(h => ({ ...h, chargeCognitive: v ?? -1 }))}
                  icon={<MovieCreationIcon sx={{ color: theme.palette.info.main }} />}
                  emptyIcon={<MovieCreationIcon sx={{ color: theme.palette.action.disabled }} />}
                  sx={{ verticalAlign: 'middle' }}
                />
                <Typography variant="body2" sx={{ ml: 2, minWidth: 90 }}>
                  {ratingLabels[hover.chargeCognitive !== undefined && hover.chargeCognitive !== -1 ? hover.chargeCognitive : data.chargeCognitive || 1]}
                </Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: theme.palette.secondary.main }}>
                Sentiment d’aisance et de sécurité pendant et après le visionnage
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormLabel sx={{ minWidth: 180, display: "none" }}>Sentiment d’aisance et de sécurité pendant et après le visionnage</FormLabel>
                <Rating
                  max={5}
                  value={data.aisance}
                  onChange={(_, v) => handleChange('aisance', v || 1)}
                  onChangeActive={(_, v) => setHover(h => ({ ...h, aisance: v ?? -1 }))}
                  icon={<MovieCreationIcon sx={{ color: theme.palette.info.main }} />}
                  emptyIcon={<MovieCreationIcon sx={{ color: theme.palette.action.disabled }} />}
                  sx={{ verticalAlign: 'middle' }}
                />
                <Typography variant="body2" sx={{ ml: 2, minWidth: 90 }}>
                  {ratingLabels[hover.aisance !== undefined && hover.aisance !== -1 ? hover.aisance : data.aisance || 1]}
                </Typography>
              </Box>
              <TextField label="Aides ou conditions qui m’auraient mieux soutenu·e" value={data.aidesMieuxSoutenu} onChange={e => handleChange('aidesMieuxSoutenu', e.target.value)} fullWidth />
            </Paper>
            <Divider />

            {/* 8) Mots-clés sensoriels, émotionnels, corporels et relationnels */}
            <Paper elevation={0} sx={sectionStyle}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.light, textTransform: 'uppercase' }}>
                8. Mots-clés sensoriels, émotionnels, corporels et relationnels
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {motsClesList.map(mot => (
                  <Chip
                    key={mot}
                    label={mot}
                    color={data.motsCles.includes(mot) ? "primary" : "default"}
                    onClick={() => handleArrayChange('motsCles', mot)}
                    variant={data.motsCles.includes(mot) ? "filled" : "outlined"}
                    clickable
                  />
                ))}
              </Box>
              <TextField label="Mot(s) personnel(s) ajouté(s)" value={data.motsPerso} onChange={e => handleChange('motsPerso', e.target.value)} fullWidth />
            </Paper>
            <Divider />

            {/* 9) Transversalité, écologie médiatique et contextualisation */}
            <Paper elevation={0} sx={sectionStyle}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.light, textTransform: 'uppercase' }}>
                9. Transversalité, écologie médiatique et contextualisation
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Avant ou après la séance, avez-vous consulté d’autres contenus (articles, critiques, médias sociaux…) sur ce film ?
              </Typography>
              <FormGroup row sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Radio checked={data.autresContenus === "Oui"} onChange={() => handleChange('autresContenus', "Oui")} />}
                  label="Oui"
                />
                <FormControlLabel
                  control={<Radio checked={data.autresContenus === "Non"} onChange={() => handleChange('autresContenus', "Non")} />}
                  label="Non"
                />
              </FormGroup>
              <TextField label="Influence sur ma réception (positive, négative, neutre)" value={data.influenceReception} onChange={e => handleChange('influenceReception', e.target.value)} fullWidth sx={{ mb: 2 }} />
              <TextField label="Autres usages médiatiques liés" value={data.autresUsages} onChange={e => handleChange('autresUsages', e.target.value)} fullWidth />
            </Paper>
            <Divider />

            {/* 10) Consentement et confidentialité */}
            <Paper elevation={0} sx={sectionStyle}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.light, textTransform: 'uppercase' }}>
                10. Consentement et confidentialité
              </Typography>
              <FormGroup row sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Checkbox checked={data.anonyme} onChange={e => handleChange('anonyme', e.target.checked)} />}
                  label="Je souhaite que ma contribution soit anonyme"
                />
                <FormControlLabel
                  control={<Checkbox checked={data.autorisation} onChange={e => handleChange('autorisation', e.target.checked)} />}
                  label="J’autorise l’usage d’extraits anonymisés dans des communications scientifiques et pédagogiques"
                />
              </FormGroup>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Je sais que je peux demander le retrait de ma contribution à tout moment.
              </Typography>
              <TextField label="Contact (facultatif)" value={data.contact} onChange={e => handleChange('contact', e.target.value)} fullWidth />
            </Paper>

            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: theme.palette.background.paper }}>
        <Button onClick={handleClose} color="secondary">
          {sent ? 'Fermer' : 'Annuler'}
        </Button>
        {!sent && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={sending}
          >
            Envoyer
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;
