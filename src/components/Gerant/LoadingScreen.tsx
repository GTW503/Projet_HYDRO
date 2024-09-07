import React, { useEffect } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000); // Durée du chargement (3 secondes)

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen">
      <img src="/Logo.webp" alt="Logo de l'entreprise" className="logo" />
      <div className="spinner"></div> {/* Optionnel : Ajoutez une animation de chargement */}
    </div>
  );
};

export default LoadingScreen;
