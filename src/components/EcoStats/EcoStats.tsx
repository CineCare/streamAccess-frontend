import { useState, useEffect } from "react";
import { IconButton, Drawer, Typography, Box, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import BoltIcon from "@mui/icons-material/Bolt"; // ⚡ Énergie
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf"; // 🌱 Version Éco
import DataUsageIcon from "@mui/icons-material/DataUsage"; // 📡 Données
import { useTheme } from "@mui/material/styles";

const StatsPanel = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [energyUsage, setEnergyUsage] = useState(1.5); // en Wh/s
  const [ecoEnergyUsage, setEcoEnergyUsage] = useState(1.2);
  const [dataUsage, setDataUsage] = useState(300); // en Ko/s
  const [ecoDataUsage, setEcoDataUsage] = useState(250);

  // Fonction pour générer une variation contrôlée et réaliste
  const getRandomVariation = (base: number, range: number) => {
    return base + (Math.random() * range - range / 2);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyUsage((prev) => getRandomVariation(prev, 0.1));
      setEcoEnergyUsage((prev) => getRandomVariation(prev, 0.05));
      setDataUsage((prev) => getRandomVariation(prev, 10));
      setEcoDataUsage((prev) => getRandomVariation(prev, 5));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Icône Stats (toujours visible) */}
      <IconButton
        onClick={() => setOpen(true)}
        color="primary"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: theme.palette.background.paper,
          border: `2px solid ${theme.palette.primary.main}`,
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
          },
        }}
      >
        <QueryStatsIcon fontSize="large" />
      </IconButton>

      {/* Panneau Stats (Drawer latéral) */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          width={400}
          p={2}
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          {/* Bouton Fermer */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Statistiques Éco vs Standard</Typography>
            <IconButton onClick={() => setOpen(false)} color="primary">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Section Énergie */}
          <Box display="flex" alignItems="center" mb={2}>
            <BoltIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="body1">Consommation Énergie</Typography>
          </Box>
          <Typography variant="h6">{energyUsage.toFixed(2)} Wh/s</Typography>
          <Box display="flex" alignItems="center" color={theme.palette.success.main} mt={0.5}>
            <EnergySavingsLeafIcon sx={{ mr: 1 }} />
            <Typography variant="body2">
              Version Éco : {ecoEnergyUsage.toFixed(2)} Wh/s
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Section Données */}
          <Box display="flex" alignItems="center" mb={2}>
            <DataUsageIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="body1">Données Transmises</Typography>
          </Box>
          <Typography variant="h6">{dataUsage.toFixed(2)} Ko/s</Typography>
          <Box display="flex" alignItems="center" color={theme.palette.success.main} mt={0.5}>
            <EnergySavingsLeafIcon sx={{ mr: 1 }} />
            <Typography variant="body2">
              Version Éco : {ecoDataUsage.toFixed(2)} Ko/s
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default StatsPanel;
