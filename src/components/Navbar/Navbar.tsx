import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo'; // Assurez-vous que le chemin vers le composant Logo est correct

const Navbar: React.FC = () => {
  const theme = useTheme();

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo à gauche */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Logo customColor={theme.palette.text.primary} width={40} marginRight={2} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            StreamAccess
          </Typography>
        </Box>
        
        {/* Onglet Films à droite près de l'icône */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to="/movies" style={{ textDecoration: "none", color: "inherit", marginRight: 10 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginRight: 2 }}>
              RÉPERTOIRE
            </Typography>
          </Link>
          <IconButton color="inherit">
            <AccountCircleIcon fontSize="large" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
