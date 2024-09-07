import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import GerantDashboard from './components/Gerant/GerantDashboard';
import PompistesDashboard from './components/Pompistes/PompistesDashboard';
import CreateCuve from './components/Admin/Cuves/CreateCuve'; // Chemin mis à jour
import { AuthProvider } from './components/Login/AuthContext'; // Import AuthContext
import ProtectedRoute from './components/Login/ProtectedRoute'; // Import ProtectedRoute

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route publique : page de connexion */}
          <Route path="/" element={<Login />} />

          {/* Routes protégées : accessibles seulement si authentifié */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/gerant" 
            element={
              <ProtectedRoute>
                <GerantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pompistes" 
            element={
              <ProtectedRoute>
                <PompistesDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Route protégée pour créer une cuve */}
          <Route 
            path="/admin/cuves/create" 
            element={
              <ProtectedRoute>
                <CreateCuve />
              </ProtectedRoute>
            } 
          />

          {/* Redirige toutes les autres routes vers la page de connexion */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
