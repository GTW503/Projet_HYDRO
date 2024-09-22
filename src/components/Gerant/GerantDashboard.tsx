import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGasPump, faWarehouse, faTruck, faBoxOpen, faChartBar, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import GerantFeedback from './GerantFeedback';
import LoadingScreen from './LoadingScreen';
import CreateApprovisionnement from './approvisionnement/CreateApprovisionnement';
import CreateAchat from './achat/CreateAchat';
import ClientForm from './client/CreateClient';
import ListeClientsTable from './client/ListeClientsTable';
import ListeAchatsTable from './achat/ListeAchatsTable';
import ListeApprovisionnementsTable from './approvisionnement/ListeApprovisionnementsTable';  
import './GerantDashboard.css';

Modal.setAppElement('#root');

const GerantDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [subFunctionality, setSubFunctionality] = useState<string | null>(null);
  const [feedbackMessages, setFeedbackMessages] = useState<{ message: string; read: boolean }[]>([]);
  const [approvisionnements, setApprovisionnements] = useState<any[]>([]);
  const [achats, setAchats] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  
  const [dataVentes, setDataVentes] = useState([
    { name: 'Lun', ventes: 0 },
    { name: 'Mar', ventes: 0 },
    { name: 'Mer', ventes: 0 },
    { name: 'Jeu', ventes: 0 },
    { name: 'Ven', ventes: 0 },
    { name: 'Sam', ventes: 0 },
    { name: 'Dim', ventes: 0 },
  ]);

  const [dataCuves, setDataCuves] = useState([
    { name: 'Cuve 1', niveau: 80 },
    { name: 'Cuve 2', niveau: 50 },
    { name: 'Cuve 3', niveau: 30 },
    { name: 'Cuve 4', niveau: 90 },
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const responseVentes = await fetch('/api/ventes');
      const dataVentes = await responseVentes.json();
      setDataVentes(dataVentes);

      const responseCuves = await fetch('/api/cuves');
      const dataCuves = await responseCuves.json();
      setDataCuves(dataCuves);
    };

    fetchData();
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  const handleNewVente = (vente: any) => {
    const updatedVentes = [...dataVentes];
    const dayOfWeek = new Date().getDay();
    updatedVentes[dayOfWeek - 1].ventes += vente.quantite;
    setDataVentes(updatedVentes);
  };

  const handleUpdateCuve = (cuve: string, niveau: number) => {
    const updatedCuves = dataCuves.map(item =>
      item.name === cuve ? { ...item, niveau: item.niveau + niveau } : item
    );
    setDataCuves(updatedCuves);
  };

  const toggleSection = (section: string) => {
    setCurrentSection(prevSection => (prevSection === section ? null : section));
  };

  const openModalWithContent = (functionality: string) => {
    setSubFunctionality(functionality);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSubFunctionality(null);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleFeedbackSubmit = (message: string) => {
    setFeedbackMessages([...feedbackMessages, { message, read: false }]);
    closeModal();
  };

  const markAllFeedbackAsRead = () => {
    const updatedFeedbacks = feedbackMessages.map(feedback => ({
      ...feedback,
      read: true,
    }));
    setFeedbackMessages(updatedFeedbacks);
  };

  const handleCreateApprovisionnement = (approvisionnement: any) => {
    setApprovisionnements([...approvisionnements, approvisionnement]);
  };

  const handleCreateAchat = (achat: any) => {
    setAchats([...achats, achat]);
  };

  const handleCreateClient = (client: any) => {
    setClients([...clients, client]);
  };

  const unreadFeedbackCount = feedbackMessages.filter(feedback => !feedback.read).length;

  return (
    <div className="gerant-dashboard">
      <div className="sidebar">
        <img src="/Logo.webp" alt="Logo" className="logo" />
        <div className="brand-name">Carburis</div>
        <div className="logo-separator"></div>
        <div className="welcome">Bienvenue, Gérant</div>
        <hr className="separator" />

        <div className={`sidebar-item ${currentSection === 'Achat' ? 'active' : ''}`} onClick={() => toggleSection('Achat')}>
          <FontAwesomeIcon icon={faBoxOpen} className="icon" /> Achat
        </div>
        {currentSection === 'Achat' && (
          <div className="sidebar-subitems show">
            <div className="sidebar-item" onClick={() => openModalWithContent('Créer un Achat')}>Créer un Achat</div>
            <div className="sidebar-item" onClick={() => openModalWithContent('Liste des Achats')}>Liste des Achats</div>
          </div>
        )}

        <div className={`sidebar-item ${currentSection === 'Approvisionnement' ? 'active' : ''}`} onClick={() => toggleSection('Approvisionnement')}>
          <FontAwesomeIcon icon={faTruck} className="icon" /> Approvisionnement
        </div>
        {currentSection === 'Approvisionnement' && (
          <div className="sidebar-subitems show">
            <div className="sidebar-item" onClick={() => openModalWithContent('Créer un Approvisionnement')}>Créer un Approvisionnement</div>
            <div className="sidebar-item" onClick={() => openModalWithContent('Liste des Approvisionnements')}>Liste des Approvisionnements</div>
          </div>
        )}

        <div className={`sidebar-item ${currentSection === 'Client' ? 'active' : ''}`} onClick={() => toggleSection('Client')}>
          <FontAwesomeIcon icon={faUsers} className="icon" /> Client
        </div>
        {currentSection === 'Client' && (
          <div className="sidebar-subitems show">
            <div className="sidebar-item" onClick={() => openModalWithContent('Ajouter un Client')}>Ajouter un Client</div>
            <div className="sidebar-item" onClick={() => openModalWithContent('Liste des Clients')}>Liste des Clients</div>
          </div>
        )}

        <div className="sidebar-item" onClick={() => { openModalWithContent('Feedbacks'); markAllFeedbackAsRead(); }}>
          <FontAwesomeIcon icon={faChartBar} className="icon" /> Feedbacks
          {unreadFeedbackCount > 0 && (
            <span className="notification-badge">{unreadFeedbackCount}</span>
          )}
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
            <p>{achats.length}</p>
          </div>
          <div className="info-box">
            <FontAwesomeIcon icon={faUsers} className="info-icon" />
            <h3>Nombre de Clients</h3>
            <p>{clients.length}</p>
          </div>
        </div>

        <div className="charts-container">
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

          <div className="chart">
            <h3>État des Cuves</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataCuves}
                  dataKey="niveau"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, niveau }) => `${name}: ${niveau}L`}
                >
                  {dataCuves.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
          <div className="printable-content">
            {subFunctionality === 'Créer un Achat' && <CreateAchat onClose={closeModal} onCreateAchat={handleCreateAchat} />}
            {subFunctionality === 'Liste des Achats' && (
              <ListeAchatsTable
                achats={[]} // Une liste vide par défaut
                onEditAchat={(achat) => console.log('Modifier achat', achat)}
                onDeleteAchat={(id) => console.log('Supprimer achat', id)}
              />
            )}
            {subFunctionality === 'Créer un Approvisionnement' && (
              <CreateApprovisionnement
                onClose={closeModal}
                fournisseurs={['Fournisseur 1', 'Fournisseur 2']}
                categories={['Catégorie 1', 'Catégorie 2']}
                produits={['Produit 1', 'Produit 2']}
                cuves={['Cuve 1', 'Cuve 2']}
              />
            )}
            {subFunctionality === 'Liste des Approvisionnements' && (
            <ListeApprovisionnementsTable
            approvisionnements={approvisionnements} // Passez ici les données d'approvisionnements
            onEditApprovisionnement={(approvisionnement) => console.log('Modifier approvisionnement', approvisionnement)} // Gérer la modification
            onDeleteApprovisionnement={(id) => console.log('Supprimer approvisionnement avec ID', id)} // Gérer la suppression
            />
            )}
          {subFunctionality === 'Ajouter un Client' && (
          <ClientForm onClose={closeModal} onAddClient={handleCreateClient} /> // Gérer l'ajout de nouveaux clients
          )}
        {subFunctionality === 'Liste des Clients' && (
         <ListeClientsTable
         clients={clients} // On passe la liste des clients en tant que prop
         onEditClient={(client) => console.log('Modifier client', client)} // Gérer la modification
         onDeleteClient={(id) => console.log('Supprimer client avec ID', id)} // Gérer la suppression
         />
         )}
          {subFunctionality === 'Feedbacks' && (
          <GerantFeedback
          feedbacks={feedbackMessages.map(feedback => feedback.message)}
          onFeedbackSubmit={handleFeedbackSubmit}
              />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default GerantDashboard;
