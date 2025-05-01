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
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher'; // Import du composant ThemeSwitcher
import PaletteIcon from '@mui/icons-material/Palette'; // Icône pour la sélection des thèmes
import CloseIcon from '@mui/icons-material/Close'; // Icône pour fermer la modale
import { Dialog, DialogContent, DialogTitle } from '@mui/material'; // Composants pour la modale
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icône pour le profil
import LogoutIcon from '@mui/icons-material/Logout'; // Icône pour la déconnexion
import AccessibilityIcon from '@mui/icons-material/Accessibility'; // Icône pour les options d'accessibilité
import Divider from '@mui/material/Divider'; // Import du séparateur

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialisation du dispatch
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useSelector((state: RootState) => state.user); // Récupération des données utilisateur depuis Redux
  const [themeDialogOpen, setThemeDialogOpen] = useState(false); // État pour la modale

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
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            StreamAccess
          </Typography>
        </Box>
        
        {/* Onglet Films et icône de thème */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to="/movies" style={{ textDecoration: "none", color: "inherit", marginRight: 10 }}>
            <Typography variant="body1" component="span" sx={{ fontWeight: "bold", marginRight: 2 }}>
              RÉPERTOIRE
            </Typography>
          </Link>
          <IconButton
            color="inherit"
            onClick={() => setThemeDialogOpen(true)} // Ouvre la modale
            sx={{ marginRight: 2 }}
          >
            <PaletteIcon /> {/* Icône pour ouvrir la sélection des thèmes */}
          </IconButton>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar src={user.avatar} alt="User Avatar" /> {/* Affiche l'avatar depuis Redux */}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 2,
                boxShadow: theme.shadows[4],
                padding: 1,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/profile');
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "8px 16px", // Ajuste le padding
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <AccountCircleIcon fontSize="small" />
              <Typography variant="body1" component="span">Profil</Typography> {/* Utilisation de component="span" */}
            </MenuItem>
            <Divider sx={{ my: 1 }} /> {/* Séparateur */}
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/accessibility-options');
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "8px 16px", // Ajuste le padding
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <AccessibilityIcon fontSize="small" />
              <Typography variant="body1" component="span">Options d'accessibilité</Typography> {/* Utilisation de component="span" */}
            </MenuItem>
            <Divider sx={{ my: 1 }} /> {/* Séparateur */}
            <MenuItem
              onClick={handleLogout}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "8px 16px", // Ajuste le padding
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <LogoutIcon fontSize="small" sx={{ color: theme.palette.error.main }} /> {/* Icône en couleur danger */}
              <Typography variant="body1" component="span" sx={{ color: theme.palette.error.main }}>Se déconnecter</Typography> {/* Utilisation de component="span" */}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Modale pour la sélection des thèmes */}
      <Dialog
        open={themeDialogOpen}
        onClose={() => setThemeDialogOpen(false)} // Ferme la modale
        maxWidth="md"
        fullWidth
        disableEnforceFocus // Désactive l'enforcement du focus par Material-UI
        aria-labelledby="theme-dialog-title"
      >
        <DialogTitle
          id="theme-dialog-title"
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}
        >
          <Typography variant="body2">Choisir un thème</Typography>
          <IconButton onClick={() => setThemeDialogOpen(false)} aria-label="Fermer">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 4,
              padding: 2,
            }}
          >
            <ThemeSwitcher layout="horizontal" /> {/* Utilisation du style horizontal */}
          </Box>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
