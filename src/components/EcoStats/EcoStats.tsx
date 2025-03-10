import { useState, useEffect } from "react";
import { IconButton, Drawer, Typography, Box } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloseIcon from "@mui/icons-material/Close";
import QueryStatsIcon from '@mui/icons-material/QueryStats';


const StatsPanel = () => {
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
        sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
      >
        <QueryStatsIcon fontSize="large" />
      </IconButton>

      {/* Panneau Stats (Drawer latéral) */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box width={400} p={2}>
          {/* Bouton Fermer */}
          <IconButton onClick={() => setOpen(false)} sx={{ float: "right" }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Statistiques Éco vs Standard
          </Typography>

          <Typography variant="body1">
            ⚡ Consommation Énergie : {energyUsage.toFixed(2)} Wh/s
          </Typography>
          <Typography variant="body2" color="textSecondary">
            🌱 Version Éco : {ecoEnergyUsage.toFixed(2)} Wh/s
          </Typography>

          <Typography variant="body1" mt={2}>
            📡 Données Transmises : {dataUsage.toFixed(2)} Ko/s
          </Typography>
          <Typography variant="body2" color="textSecondary">
            🌱 Version Éco : {ecoDataUsage.toFixed(2)} Ko/s
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default StatsPanel;
