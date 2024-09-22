import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faChartBar, faGasPump, faFileAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PompisteFeedback from './PompisteFeedback';
import EnregistrerVente from './ventes/EnregistrerVente'; // Import the EnregistrerVente component
import ListeVentesTable from './ventes/ListeVentesTable'; // Import ListeVentesTable
import './PompisteDashboard.css';

// Données de couleurs pour le diagramme circulaire
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

Modal.setAppElement('#root');

const PompisteDashboard: React.FC = () => {
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<string>(''); 
  const [ventes, setVentes] = useState<any[]>([]); // Liste vide par défaut
  const [dataProduits, setDataProduits] = useState([
    { name: 'Essence', niveau: 1500 },
    { name: 'Diesel', niveau: 1200 },
    { name: 'Kérosène', niveau: 800 },
    { name: 'GPL', niveau: 600 },
  ]); 
  const [dataVentes, setDataVentes] = useState([
    { name: 'Lun', ventes: 30 },
    { name: 'Mar', ventes: 45 },
    { name: 'Mer', ventes: 60 },
    { name: 'Jeu', ventes: 40 },
    { name: 'Ven', ventes: 75 },
    { name: 'Sam', ventes: 50 },
    { name: 'Dim', ventes: 20 },
  ]);

  const navigate = useNavigate();

  // Mettre à jour l'heure chaque seconde
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('fr-FR', { hour12: false });
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
          <div className="current-time">
            {currentTime}
          </div>
          <div className="notifications">
            <FontAwesomeIcon icon={faChartBar} className="notification-icon" />
          </div>
        </div>

        <div className="dashboard-container">
          <div className="charts-container">
            <div className="chart">
              <h3>Niveau des Produits</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataProduits}
                    dataKey="niveau"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, niveau }) => `${name}: ${niveau}L`}
                  >
                    {dataProduits.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
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
              <EnregistrerVente onClose={closeModal} clients={[]} produits={[]} categories={[]} />
            )}
            {modalContent === 'Liste des Ventes' && (
              <ListeVentesTable
                ventes={[]} // Liste des ventes initialement vide
                onEditVente={(vente) => console.log('Modifier vente', vente)}
                onDeleteVente={(id) => console.log('Supprimer vente', id)}
              />
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
