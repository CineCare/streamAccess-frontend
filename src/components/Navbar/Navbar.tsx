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
import { useDispatch } from 'react-redux';
import { logout } from '../../providers/store'; // Import de l'action logout
import Logo from '../Logo/Logo';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher'; // Import du composant ThemeSwitcher
import PaletteIcon from '@mui/icons-material/Palette'; // Icône pour la sélection des thèmes
import CloseIcon from '@mui/icons-material/Close'; // Icône pour fermer la modale
import Drawer from '@mui/material/Drawer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icône pour le profil
import LogoutIcon from '@mui/icons-material/Logout'; // Icône pour la déconnexion
import AccessibilityIcon from '@mui/icons-material/Accessibility'; // Icône pour les options d'accessibilité
import Divider from '@mui/material/Divider'; // Import du séparateur
import Badge from '@mui/material/Badge'; // Import du badge pour les notifications
import NotificationsIcon from '@mui/icons-material/Notifications'; // Icône pour les notifications
import SettingsIcon from '@mui/icons-material/Settings'; // Icône pour la gestion des contenus
import { useAvatar } from '../../hooks/useAvatar';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialisation du dispatch
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false); // Renommer la variable d'état
  const { avatar } = useAvatar();

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
            onClick={() => setThemeDrawerOpen(true)} // Mettre à jour le nom de la fonction
            sx={{ marginRight: 2 }}
          >
            <PaletteIcon /> {/* Icône pour ouvrir la sélection des thèmes */}
          </IconButton>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar src={avatar} alt="User Avatar">
              <AccountCircleIcon /> {/* S'affiche si pas d'avatar */}
            </Avatar>
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
              onClick={() => {
                handleMenuClose();
                navigate('/notifications');
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
              <Badge
                badgeContent={5} // Exemple : 5 notifications non lues
                color="error"
                sx={{ "& .MuiBadge-badge": { fontSize: "0.75rem", height: 20, minWidth: 20 } }}
              >
                <NotificationsIcon fontSize="small" />
              </Badge>
              <Typography variant="body1" component="span">Notifications</Typography>
            </MenuItem>
            <Divider sx={{ my: 1 }} /> {/* Séparateur */}
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/content-management');
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
              <SettingsIcon fontSize="small" />
              <Typography variant="body1" component="span">Gestion des contenus</Typography>
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

      {/* Remplacer la Dialog par un Drawer */}
      <Drawer
        anchor="bottom"
        open={themeDrawerOpen}
        onClose={() => setThemeDrawerOpen(false)}
      >
        <Box
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="h6">Choisir un thème</Typography>
            <IconButton onClick={() => setThemeDrawerOpen(false)} aria-label="Fermer">
              <CloseIcon />
            </IconButton>
          </Box>
          <ThemeSwitcher layout="horizontal" />
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
