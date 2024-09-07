import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from './AuthContext'; // Import du contexte d'authentification
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Contrôle l'affichage du mot de passe
  const { login } = useContext(AuthContext); // Utilise la fonction de login depuis le contexte d'authentification
  const navigate = useNavigate();

  const handleLogin = () => {
    // Vérifie les identifiants
    if (username === 'admin' && password === 'admin@2024') {
      login(); // Met à jour l'état d'authentification
      navigate('/admin'); // Redirige vers le dashboard Admin
    } else if (username === 'gerantstat' && password === 'ger@1234') {
      login();
      navigate('/gerant'); // Redirige vers le dashboard Gérant
    } else if (username === 'pop@123' && password === 'pompis@789') {
      login();
      navigate('/pompistes'); // Redirige vers le dashboard Pompistes
    } else {
      alert('Nom d’utilisateur ou mot de passe incorrect');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  return (
    <div className="login-container">
      <div className="image-container">
        <img src="/log.jpg" alt="Image de connexion" className="login-image" />
      </div>
      <div className="login-box">
        <img src="/Logo.webp" alt="Logo de l'entreprise" className="logo-image animated-logo" /> {/* Logo intégré avec animation */}
        <h2>Connexion</h2>
        <form>
          <div className="input-container">
            <label>Nom d'utilisateur</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-container password-container">
            <label>Mot de passe</label>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <FontAwesomeIcon 
              icon={showPassword ? faEyeSlash : faEye} 
              onClick={togglePasswordVisibility} 
              className="password-icon" 
            />
          </div>
          <div className="remember-me-container">
            <input type="checkbox" />
            <label>Se souvenir de moi</label>
          </div>
          <button type="button" onClick={handleLogin}>
            Connexion
          </button>
          <a href="#" className="forgot-password">Mot de passe oublié ?</a>
        </form>
      </div>
    </div>
  );
};

export default Login;
