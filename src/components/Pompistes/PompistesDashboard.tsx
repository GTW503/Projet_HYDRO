import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faChartBar, faGasPump, faFileAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NiveauStockChart from './NiveauStockChart';
import PompisteFeedback from './PompisteFeedback'; // Importez le composant de feedback
import './PompisteDashboard.css';

Modal.setAppElement('#root');

const PompisteDashboard: React.FC = () => {
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<string[]>([]); // État pour stocker les feedbacks
  const navigate = useNavigate();

  const dataVentes = [
    { name: 'Lun', ventes: 30 },
    { name: 'Mar', ventes: 45 },
    { name: 'Mer', ventes: 60 },
    { name: 'Jeu', ventes: 40 },
    { name: 'Ven', ventes: 75 },
    { name: 'Sam', ventes: 50 },
    { name: 'Dim', ventes: 20 },
  ];

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
    setFeedbacks([...feedbacks, message]);
  };

  return (
    <div className="pompiste-dashboard">
      <div className="sidebar">
        <img src="/Logo.webp" alt="Logo" className="logo" />
        <div className="brand-name">Carburis</div>
        <div className="logo-separator"></div>
        <div className="welcome">Bienvenue, Pompiste</div>
        <hr className="separator" />

        <div className="sidebar-item" onClick={() => toggleSection('Ventes')}>
          <FontAwesomeIcon icon={faGasPump} className="icon" /> Ventes
        </div>
        {openSection === 'Ventes' && (
          <div className="dropdown-content">
            <div onClick={() => openModal('Enregistrer une Vente')}>Enregistrer une Vente</div>
            <div onClick={() => openModal('Liste des Ventes')}>Liste des Ventes</div>
          </div>
        )}

        <div className="sidebar-item" onClick={() => toggleSection('Stock')}>
          <FontAwesomeIcon icon={faChartPie} className="icon" /> Niveau de Stock
        </div>

        <div className="sidebar-item" onClick={() => openModal('FeedbackStock')}>
          <FontAwesomeIcon icon={faFileAlt} className="icon" /> Feedback de niveau Stock
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

        <div className="dashboard-container">
          <div className="charts-container">
            <div className="chart">
              <NiveauStockChart />
            </div>
            <div className="chart">
              <h3>Ventes Hebdomadaires</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataVentes}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ventes" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
          <div>
            {modalContent === 'Enregistrer une Vente' && (
              <div>
                <h2>Enregistrer une Vente</h2>
                <form>
                  <label>Produit:</label>
                  <input type="text" placeholder="Produit" required />
                  <label>Quantité:</label>
                  <input type="number" placeholder="Quantité" required />
                  <label>Prix:</label>
                  <input type="number" placeholder="Prix" required />
                  <button type="submit">Enregistrer</button>
                </form>
              </div>
            )}
            {modalContent === 'Liste des Ventes' && (
              <div>
                <h2>Liste des Ventes</h2>
                {/* Code pour afficher la liste des ventes */}
              </div>
            )}
            {modalContent === 'FeedbackStock' && (
              <PompisteFeedback onFeedbackSubmit={handleFeedbackSubmit} onClose={closeModal} />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PompisteDashboard;
