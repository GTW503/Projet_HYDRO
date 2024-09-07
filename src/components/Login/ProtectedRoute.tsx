// src/components/Login/ProtectedRoute.tsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Assurez-vous du chemin correct

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirige vers la page de connexion si non authentifié
  }

  return children; // Affiche la route protégée si authentifié
};

export default ProtectedRoute;
