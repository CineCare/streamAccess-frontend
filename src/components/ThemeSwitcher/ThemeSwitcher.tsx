import React, { useContext } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ThemeContext } from "../../styles/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode"; // 🌞 Mode Lumineux
import ContrastIcon from "@mui/icons-material/Contrast"; // ⚡ Mode Contraste Élevé
import TextIncreaseIcon from "@mui/icons-material/TextIncrease"; // 🔠 Grand Texte
import SpaIcon from "@mui/icons-material/Spa"; // 🌸 Mode Doux
import WaterIcon from "@mui/icons-material/Water"; // 🌊 Thème Standard

const ThemeSwitcher: React.FC = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    return null; // or handle the error as needed
  }

  const { theme, setTheme } = themeContext;

  const handleThemeChange = (_: React.MouseEvent<HTMLElement>, newTheme: string) => {
    setTheme(newTheme as "default" | "soft" | "lightTheme" | "highContrast" | "largeText");
  };

  return (
    <ToggleButtonGroup
    value={theme}
    exclusive
    onChange={handleThemeChange}
    aria-label="Choisir un thème"
    sx={{ display: "flex", justifyContent: "center", gap: 1, marginTop: 2 }}
  >
    <ToggleButton value="default" aria-label="Thème Standard">
      <WaterIcon /> {/* 🌊 */}
    </ToggleButton>
    <ToggleButton value="soft" aria-label="Thème Doux">
      <SpaIcon /> {/* 🌸 */}
    </ToggleButton>
    <ToggleButton value="lightTheme" aria-label="Thème Lumineux">
      <LightModeIcon /> {/* 🌞 */}
    </ToggleButton>
    <ToggleButton value="highContrast" aria-label="Thème Contrasté">
      <ContrastIcon /> {/* ⚡ */}
    </ToggleButton>
    <ToggleButton value="largeText" aria-label="Grand Texte">
      <TextIncreaseIcon /> {/* 🔠 */}
    </ToggleButton>
  </ToggleButtonGroup>
  );
};

export default ThemeSwitcher;

