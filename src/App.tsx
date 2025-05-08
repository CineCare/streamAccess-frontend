import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./providers/store";
import AuthPage from "./pages/Auth-page/Auth-page";
import MoviesPage from "./pages/Movies-page/Movies-page";
import MoviePage from "./pages/Movie-page/Movie-page";
import CreateMovie from "./pages/Create-Movie-page/Create-movie";
import ProfilePage from "./pages/Profile-page/Profile-page";
import { AccessibilityThemeManager } from "./styles/AccessibilityThemeManager";
import ContentManagement from "./pages/ContentManagement/ContentManagement";
import EditMovie from "./pages/EditMovie/EditMovie";
import AccessibilityOptionsPage from "./pages/AccessibilityOptionsPage";
// import WSProvider from "./providers/WSProvider";
// import { useSocket } from "./hooks/useSocket";

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const token = localStorage.getItem("accessToken");

  if (!isAuthenticated || !token) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }
  // Wrap Outlet in a WS Provider
  // return <WSProvider><Outlet /></WSProvider>;
  return <Outlet />;
};

const App: React.FC = () => {
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
          {/* Route publique */}
          <Route path="/" element={<AuthPage />} />

          {/* Route protégée */}
          <Route element={<ProtectedRoute />}>
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/createmovie" element={<CreateMovie />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/content-management" element={<ContentManagement />} />
            <Route path="/editmovie/:id" element={<EditMovie />} />
            <Route path="/accessibility-options" element={<AccessibilityOptionsPage />} />
          </Route>
        </Routes>
      </Router>
    </AccessibilityThemeManager>
  );
};

export default App;