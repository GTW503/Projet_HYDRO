import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGasPump, faWarehouse, faTruck, faBoxOpen, faChartBar, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import GerantFeedback from './GerantFeedback'; // Importez le composant de feedback
import LoadingScreen from './LoadingScreen'; // Importez le composant LoadingScreen
import './GerantDashboard.css';

Modal.setAppElement('#root');

const GerantDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true); // État pour gérer l'affichage de l'écran de chargement
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]); // Gestion des messages de feedback

  const navigate = useNavigate();

  const toggleSection = (section: string) => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  const openModal = (content: string) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalIsOpen(false);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleFeedbackSubmit = (message: string) => {
    setFeedbackMessages([...feedbackMessages, message]); // Ajouter le feedback aux messages existants
    closeModal();
  };

  const dataApprovisionnement = [
    { name: 'Lun', approvisionnement: 30 },
    { name: 'Mar', approvisionnement: 45 },
    { name: 'Mer', approvisionnement: 60 },
    { name: 'Jeu', approvisionnement: 40 },
    { name: 'Ven', approvisionnement: 75 },
    { name: 'Sam', approvisionnement: 50 },
    { name: 'Dim', approvisionnement: 20 },
  ];

  const dataCuves = [
    { name: 'Cuve 1', niveau: 80 },
    { name: 'Cuve 2', niveau: 50 },
    { name: 'Cuve 3', niveau: 30 },
    { name: 'Cuve 4', niveau: 90 },
  ];

  // Fonction à appeler lorsque le chargement est terminé
  const handleLoadingComplete = () => {
    setLoading(false);
  };

  // Afficher l'écran de chargement tant que le chargement n'est pas terminé
  if (loading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="gerant-dashboard">
      <div className="sidebar">
        <img src="/Logo.webp" alt="Logo" className="logo" />
        <div className="brand-name">Carburis</div>
        <div className="logo-separator"></div>
        <div className="welcome">Bienvenue, Gérant</div>
        <hr className="separator" />

        <div className="sidebar-item" onClick={() => toggleSection('Achat')}>
          <FontAwesomeIcon icon={faBoxOpen} className="icon" /> Achat
        </div>

        <div className="sidebar-item" onClick={() => toggleSection('Approvisionnement')}>
          <FontAwesomeIcon icon={faTruck} className="icon" /> Approvisionnement
        </div>

        <div className="sidebar-item" onClick={() => toggleSection('Client')}>
          <FontAwesomeIcon icon={faUsers} className="icon" /> Client
        </div>

        <div className="sidebar-item" onClick={() => openModal('Alertes')}>
          <FontAwesomeIcon icon={faChartBar} className="icon" /> Alertes
        </div>

        <div className="sidebar-item" onClick={() => toggleSection('Stock')}>
          <FontAwesomeIcon icon={faWarehouse} className="icon" /> Stock Carburant
        </div>

        <hr className="separator" />
        <div className="sidebar-item logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Déconnexion
        </div>
      </div>

      <div className="main-content">
        <div className="navbar">
          <input type="text" placeholder="Rechercher..." className="search-bar" />
          <div className="notifications">
            <FontAwesomeIcon icon={faChartBar} className="notification-icon" />
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-box">
            <FontAwesomeIcon icon={faBoxOpen} className="info-icon" />
            <h3>Nombre d'Achats</h3>
            <p>150</p>
          </div>
          <div className="info-box">
            <FontAwesomeIcon icon={faUsers} className="info-icon" />
            <h3>Nombre de Clients</h3>
            <p>200</p>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart">
            <h3>Approvisionnements Hebdomadaires</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dataApprovisionnement}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="approvisionnement" stroke="#007bff" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart">
            <h3>État des Cuves</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataCuves}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="niveau" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
          <div>
            {modalContent === 'Alertes' && (
              <GerantFeedback feedbacks={feedbackMessages} onFeedbackSubmit={handleFeedbackSubmit} />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default GerantDashboard;
