// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import AuthPage from './pages/Auth-page/Auth-page';
import MoviesPage from './pages/Movies-page/Movies-page';
// Ajoute d'autres imports pour tes pages

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline /> {/* Pour appliquer les styles de base de MUI */}
      <Routes>
        <Route path="/" element={<AuthPage />} /> {/* Page d'authentification */}
        <Route path="/movies" element={<MoviesPage />} /> {/* Page du catalogue */}
        {/* Ajoute d'autres routes ici */}
      </Routes>
    </Router>
  );
};

export default App;
