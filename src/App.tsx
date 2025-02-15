import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import AuthPage from './pages/Auth-page/Auth-page';
import MoviesPage from './pages/Movies-page/Movies-page';
import MoviePage from './pages/Movie-page/Movie-page';
import CreateMovie from './pages/Create-Movie-page/Create-movie';
import { AccessibilityThemeManager } from './styles/AccessibilityThemeManager'; // Import du gestionnaire de thèmes

// Ajoute d'autres imports pour tes pages si nécessaire

const App: React.FC = () => {
  return (
    <AccessibilityThemeManager> {/* Gestionnaire de thème global */}
      <CssBaseline /> {/* Pour appliquer les styles de base de MUI */}
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} /> {/* Page d'authentification */}
          <Route path="/movies" element={<MoviesPage />} /> {/* Page du catalogue */}
          <Route path="/movie/:id" element={<MoviePage />} /> {/* Page du catalogue */}
          <Route path="/createmovie" element={<CreateMovie />} /> {/* Page du catalogue */}
          {/* Ajoute d'autres routes ici */}
        </Routes>
      </Router>
    </AccessibilityThemeManager>
  );
};

export default App;