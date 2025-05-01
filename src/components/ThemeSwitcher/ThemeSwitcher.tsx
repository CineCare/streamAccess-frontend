import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setThemePreference } from "../../providers/store"; // Import de l'action Redux
import LightModeIcon from "@mui/icons-material/LightMode"; // 🌞 Mode Lumineux
import ContrastIcon from "@mui/icons-material/Contrast"; // ⚡ Mode Contraste Élevé
import TextIncreaseIcon from "@mui/icons-material/TextIncrease"; // 🔠 Grand Texte
import SpaIcon from "@mui/icons-material/Spa"; // 🌸 Mode Doux
import WaterIcon from "@mui/icons-material/Water"; // 🌊 Thème Standard
import Typography from "@mui/material/Typography";

// Ajout des props pour définir le layout et l'affichage des labels
interface ThemeSwitcherProps {
  layout?: "horizontal" | "vertical"; // Définit le style : horizontal ou vertical
  showLabels?: boolean; // Affiche ou masque les labels
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ layout = "horizontal", showLabels = true }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.accessibility.preferences.general.theme || "default");

  const handleThemeChange = (_: React.MouseEvent<HTMLElement>, newTheme: string) => {
    if (newTheme) {
      dispatch(setThemePreference(newTheme)); // Met à jour le thème dans le store
    }
  };

  return (
    <ToggleButtonGroup
      value={theme}
      exclusive
      onChange={handleThemeChange}
      aria-label="Choisir un thème"
      sx={{
        display: "flex",
        flexDirection: layout === "horizontal" ? "row" : "column", // Disposition horizontale ou verticale
        justifyContent: layout === "horizontal" ? "space-between" : "center", // Espacement
        alignItems: "center",
        gap: layout === "horizontal" ? 2 : 1, // Espacement entre les boutons
        overflowX: layout === "horizontal" ? "auto" : "visible", // Défilement horizontal si nécessaire
        padding: 1,
      }}
    >
      {[{ value: "default", label: "Standard", icon: <WaterIcon /> },
        { value: "soft", label: "Doux", icon: <SpaIcon /> },
        { value: "lightTheme", label: "Lumineux", icon: <LightModeIcon /> },
        { value: "highContrast", label: "Contraste", icon: <ContrastIcon /> },
        { value: "largeText", label: "Grand Texte", icon: <TextIncreaseIcon /> },
      ].map(({ value, label, icon }, index, array) => (
        <ToggleButton
          key={value}
          value={value}
          aria-label={`Thème ${label}`}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: layout === "horizontal" ? 100 : "auto", // Largeur fixe pour horizontal
            minWidth: layout === "horizontal" ? 100 : "auto",
            height: layout === "horizontal" ? 100 : "auto", // Hauteur fixe pour horizontal
            borderRadius: layout === "horizontal"
              ? index === 0
                ? "8px 0 0 8px" // Bord arrondi à gauche pour le premier bouton en horizontal
                : index === array.length - 1
                ? "0 8px 8px 0" // Bord arrondi à droite pour le dernier bouton en horizontal
                : 0
              : index === 0
              ? "8px 8px 0 0" // Bord arrondi en haut pour le premier bouton en vertical
              : index === array.length - 1
              ? "0 0 8px 8px" // Bord arrondi en bas pour le dernier bouton en vertical
              : 0,
            backgroundColor: theme === value ? "action.hover" : "background.paper", // Fond différent si sélectionné
            boxShadow: theme === value ? 4 : 1, // Ombre plus forte si sélectionné
            "&:hover": {
              boxShadow: 4, // Ombre plus forte au survol
              backgroundColor: "action.hover", // Changement de couleur au survol
            },
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: layout === "horizontal" ? 40 : 24 } })} {/* Taille des icônes */}
          {showLabels && <Typography variant="body2">{label}</Typography>} {/* Affiche le label si showLabels est true */}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ThemeSwitcher;

