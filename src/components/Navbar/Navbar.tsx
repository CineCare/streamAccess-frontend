import React, { useEffect, useState } from 'react';
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
import { RootState } from '../../providers/store';
import { logout, markNotificationAsRead, markAllNotificationsAsRead } from '../../providers/store'; // Import des actions Redux
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
import Modal from '@mui/material/Modal'; // Import de la modale
import List from '@mui/material/List'; // Import de la liste
import ListItem from '@mui/material/ListItem'; // Import des éléments de la liste
import ListItemText from '@mui/material/ListItemText'; // Import du texte des éléments
import Button from '@mui/material/Button'; // Import du bouton
import { IoProvider } from '../../interfaces/IIoProvider';
import useIoSocket from '../../hooks/useSocket';
import Chatbot from '../Chatbot/Chatbot';


const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { avatar } = useAvatar();
  const notifications = useSelector((state: RootState) => state.notifications.list); // Sélecteur pour les notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  //essai WS
  const { ioClose, socket } = useIoSocket() as IoProvider;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [,setContactOpen] = useState(false);

  const handleNotificationClick = (id: number) => {
    dispatch(markNotificationAsRead(id)); // Marque une notification comme lue
  };

  const handleNotificationHover = (id: number) => {
    dispatch(markNotificationAsRead(id)); // Marque une notification comme lue au survol
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead()); // Marque toutes les notifications comme lues
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connecté au serveur WebSocket'); // Affiche un message de connexion dans la console
    })

    socket.on('disconnect', (reason) => {
      console.log('Déconnecté du serveur WebSocket : ', reason); // Affiche un message de déconnexion dans la console
    })
    
    socket.on('welcome', (message: string) => {
      console.log(message); // Affiche le message de bienvenue dans la console
    })

    socket.on('movies', (message: string) => {
      console.log('Films : ', message); // Affiche le message reçu dans la console
    })

    socket.on('users', (message: string) => {
      console.log('Utilisateurs : ', message); // Affiche le message reçu dans la console
    })

    socket.on('team', (message: string) => {
      console.log('News : ', message); // Affiche le message reçu dans la console
    })

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('welcome');
      socket.off('movies');
      socket.off('users');
      socket.off('team');
      ioClose();
    }
  })

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
          <Chatbot actionsCtx={{
        navigate,                     // 👈 très important
        openContact: () => setContactOpen(true),
        fetchJson: (url) => fetch(url).then(r => r.json()),
      }}/>
          <Link to="/movies" style={{ textDecoration: "none", color: "inherit", marginRight: 10 }}>
            <Typography variant="body1" component="span" sx={{ fontWeight: "bold", marginRight: 2 }}>
              RÉPERTOIRE
            </Typography>
          </Link>
          <IconButton
            color="inherit"
            onClick={() => setThemeDrawerOpen(true)} // Mettre à jour le nom de la fonction
            sx={{ marginRight: 2 }}
            aria-label="Ouvrir le sélecteur de thème" // Ajout d'un label accessible
          >
            <PaletteIcon /> {/* Icône pour ouvrir la sélection des thèmes */}
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => setNotificationModalOpen(true)}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{ "& .MuiBadge-badge": { fontSize: "0.75rem", height: 20, minWidth: 20 } }}
            >
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar
              src={avatar}
              alt="Avatar utilisateur" // Assurez-vous que cet attribut correspond au texte attendu dans le test
              data-testid="user-avatar" // Ajout d'un data-testid pour cibler l'élément dans les tests
            >
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
                navigate('/accessibility-options'); // Redirige vers la page des options d'accessibilité
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
              <Typography variant="body1" component="span">Options d'accessibilité</Typography>
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
              data-testid="logout-button" // Ajout d'un data-testid pour cibler cet élément dans les tests
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
              <Typography variant="body1" component="span" sx={{ color: theme.palette.error.main }}>Se déconnecter</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

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

      {/* Modale pour les notifications */}
      <Modal
        open={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        aria-labelledby="notification-modal-title"
        aria-describedby="notification-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography id="notification-modal-title" variant="h6" component="h2">
              Notifications
            </Typography>
            <IconButton onClick={() => setNotificationModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                onMouseEnter={() => handleNotificationHover(notification.id)}
                sx={{
                  backgroundColor: notification.read
                    ? 'transparent'
                    : theme.palette.action.hover,
                  borderRadius: 1,
                  mb: 1,
                  transition: 'background-color 0.3s',
                }}
              >
                <ListItemText
                  primary={notification.text}
                  primaryTypographyProps={{
                    fontWeight: notification.read ? 'normal' : 'bold',
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={handleMarkAllAsRead}
            sx={{ alignSelf: 'center', mb: 2 }}
          >
            Tout marquer comme lu
          </Button>
        </Box>
      </Modal>
    </AppBar>
  );
};

export default Navbar;
