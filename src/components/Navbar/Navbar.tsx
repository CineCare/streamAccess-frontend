import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../providers/store'; // Import du store Redux
import { logout } from '../../providers/store'; // Import de l'action logout
import Logo from '../Logo/Logo';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialisation du dispatch
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useSelector((state: RootState) => state.user); // Récupération des données utilisateur depuis Redux

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout()); // Vider les données du store
    navigate('/'); // Redirige vers la page d'accueil
  };

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
        
        {/* Onglet Films à droite près de l'avatar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to="/movies" style={{ textDecoration: "none", color: "inherit", marginRight: 10 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginRight: 2 }}>
              RÉPERTOIRE
            </Typography>
          </Link>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar src={user.avatar} alt="User Avatar" /> {/* Affiche l'avatar depuis Redux */}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profil</MenuItem>
            <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/accessibility-options'); }}>Options d'accessibilité</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
