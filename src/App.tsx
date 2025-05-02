import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, fetchMovies, AppDispatch } from "./providers/store";
import AuthPage from "./pages/Auth-page/Auth-page";
import MoviesPage from "./pages/Movies-page/Movies-page";
import MoviePage from "./pages/Movie-page/Movie-page";
import CreateMovie from "./pages/Create-Movie-page/Create-movie";
import ProfilePage from "./pages/Profile-page/Profile-page";
import { AccessibilityThemeManager } from "./styles/AccessibilityThemeManager";
import ContentManagement from "./pages/ContentManagement/ContentManagement";
import EditMovie from "./pages/EditMovie/EditMovie";
import AccessibilityOptionsPage from "./pages/AccessibilityOptionsPage";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const token = localStorage.getItem("accessToken");

  if (!isAuthenticated || !token) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMovies()); // Charge les films dans le store après authentification
  }, [dispatch]);

  return (
    <AccessibilityThemeManager>
      <CssBaseline />
      <Router
        future={{
          v7_startTransition: true, // Active React.startTransition pour les mises à jour d'état
          v7_relativeSplatPath: true, // Active la résolution relative des routes dans les splats
        }}
      >
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <MoviesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <MoviePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createmovie"
            element={
              <ProtectedRoute>
                <CreateMovie />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content-management"
            element={
              <ProtectedRoute>
                <ContentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editmovie/:id"
            element={
              <ProtectedRoute>
                <EditMovie />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accessibility-options"
            element={
              <ProtectedRoute>
                <AccessibilityOptionsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AccessibilityThemeManager>
  );
};

export default App;