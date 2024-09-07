import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGasPump, faWarehouse, faTruck, faBoxOpen, faChartBar, faSignOutAlt, faBuilding } from '@fortawesome/free-solid-svg-icons';

// Importation des composants nécessaires
import CreateCuve from './Cuves/CreateCuve';
import CreateProduit from './Produits/CreateProduit';
import CreateFournisseur from './Fournisseurs/CreateFournisseur';
import CreateApprovisionnement from './Approvisionnement/CreateApprovisionnement';
import ProduitBarChart from './Produits/ProduitBarChart';
import CreatePompe from './Pompes/CreatePompe';
import StationForm from './Station/StationForm';
import CuveTable from './Cuves/CuveTable';
import EmployeForm from './Employes/EmployeForm';
import ProductTable from './Produits/ProductTable';
import EmployeTable from './Employes/EmployeTable';
import PompeTable from './Pompes/PompeTable';
import FournisseurTable from './Fournisseurs/FournisseurTable';
import ApprovisionnementTable from './Approvisionnement/ApprovisionnementTable';
import StationHeader from './Station/StationHeader'; // Assure-toi d'avoir ce composant

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

Modal.setAppElement('#root');

const AdminDashboard: React.FC = () => {
  // Gestion de l'état
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [stationData, setStationData] = useState<StationData | null>(null); // Les données de la station

  // Données pour les tableaux
  const [categories] = useState<string[]>(['Essence', 'Diesel']);
  const [produits, setProduits] = useState<any[]>([]); 
  const [employees, setEmployees] = useState<any[]>([]); 
  const [pompes, setPompes] = useState<any[]>([]); 
  const [cuves, setCuves] = useState<any[]>([]); 
  const [fournisseurs, setFournisseurs] = useState<any[]>([]);
  const [approvisionnements, setApprovisionnements] = useState<any[]>([]);

  const [employeesCount] = useState(employees.length);
  const [tanksCount] = useState(cuves.length);
  const [pumpsCount] = useState(pompes.length);

  const navigate = useNavigate();

  // Fonctions pour gérer les sections
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

  // Fonction pour enregistrer les données de la station
  const handleSaveStation = (data: StationData) => {
    setStationData(data); // Mise à jour des données de la station
    closeModal();
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Données pour les graphiques
  const dataApprovisionnement = [
    { name: 'Lun', approvisionnement: 30 },
    { name: 'Mar', approvisionnement: 45 },
    { name: 'Mer', approvisionnement: 60 },
    { name: 'Jeu', approvisionnement: 40 },
    { name: 'Ven', approvisionnement: 75 },
    { name: 'Sam', approvisionnement: 50 },
    { name: 'Dim', approvisionnement: 20 },
  ];

  const dataProduits = [
    { name: 'Jour', produits: 10 },
    { name: 'Semaine', produits: 50 },
    { name: 'Mois', produits: 200 },
    { name: 'Année', produits: 1000 },
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <img src="/Logo.webp" alt="Logo" className="logo" />
        <div className="brand-name">Carburis</div>
        <div className="logo-separator"></div>
        <div className="welcome">Bienvenue, Admin</div>
        <hr className="separator" />

        {/* Navigation dans la sidebar */}
        <div className="sidebar-item" onClick={() => toggleSection('Station')}>
          <FontAwesomeIcon icon={faBuilding} className="icon" /> Station
        </div>
        {openSection === 'Station' && (
          <div className="dropdown-content">
            <div onClick={() => openModal('Enrégistrer la station')}>Voir la Station</div>
          </div>
        )}

        <div className="sidebar-item" onClick={() => toggleSection('Pompes')}>
          <FontAwesomeIcon icon={faGasPump} className="icon" /> Pompes
        </div>
        {openSection === 'Pompes' && (
          <div className="dropdown-content">
            <div onClick={() => openModal('Créer une Pompe')}>Créer une Pompe</div>
            <div onClick={() => openModal('Liste des Pompes')}>Liste des Pompes</div>
          </div>
        )}

        <div className="sidebar-item" onClick={() => toggleSection('Cuves')}>
          <FontAwesomeIcon icon={faWarehouse} className="icon" /> Cuves
        </div>
        {openSection === 'Cuves' && (
          <div className="dropdown-content">
            <div onClick={() => openModal('Créer une Cuve')}>Créer une Cuve</div>
            <div onClick={() => openModal('Liste des Cuves')}>Liste des Cuves</div>
          </div>
        )}

        <div className="sidebar-item" onClick={() => toggleSection('Employé')}>
          <FontAwesomeIcon icon={faUsers} className="icon" /> Employé
        </div>
        {openSection === 'Employé' && (
          <div className="dropdown-content">
            <div onClick={() => openModal('Ajouter un Employé')}>Ajouter un Employé</div>
            <div onClick={() => openModal('Liste des Employés')}>Liste des Employés</div>
          </div>
        )}

        <div className="sidebar-item" onClick={() => toggleSection('Fournisseur')}>
          <FontAwesomeIcon icon={faTruck} className="icon" /> Fournisseur
        </div>
        {openSection === 'Fournisseur' && (
          <div className="dropdown-content">
            <div onClick={() => openModal('Ajouter un Fournisseur')}>Ajouter un Fournisseur</div>
            <div onClick={() => openModal('Liste des Fournisseurs')}>Liste des Fournisseurs</div>
          </div>
        )}

        <div className="sidebar-item" onClick={() => toggleSection('Approvisionnement')}>
          <FontAwesomeIcon icon={faBoxOpen} className="icon" /> Approvisionnement
        </div>
        {openSection === 'Approvisionnement' && (
          <div className="dropdown-content">
            <div onClick={() => openModal('Ajouter un Approvisionnement')}>Ajouter un Approvisionnement</div>
            <div onClick={() => openModal('Liste des Approvisionnements')}>Liste des Approvisionnements</div>
          </div>
        )}

        <div className="sidebar-item" onClick={() => toggleSection('Produits')}>
          <FontAwesomeIcon icon={faBoxOpen} className="icon" /> Produits
        </div>
        {openSection === 'Produits' && (
          <div className="dropdown-content">
            <div onClick={() => openModal('Créer un Produit')}>Créer un Produit</div>
            <div onClick={() => openModal('Liste des Produits')}>Liste des Produits</div>
          </div>
        )}

        <hr className="separator" />
        <div className="sidebar-item logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Déconnexion
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="main-content">
        <div className="navbar">
          <input type="text" placeholder="Rechercher..." className="search-bar" />
          <div className="notifications">
            <FontAwesomeIcon icon={faChartBar} className="notification-icon" />
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-box">
            <FontAwesomeIcon icon={faUsers} className="info-icon" />
            <h3>Nombre d'Employés</h3>
            <p>{employeesCount}</p>
          </div>
          <div className="info-box">
            <FontAwesomeIcon icon={faWarehouse} className="info-icon" />
            <h3>Nombre de Cuves</h3>
            <p>{tanksCount}</p>
          </div>
          <div className="info-box">
            <FontAwesomeIcon icon={faGasPump} className="info-icon" />
            <h3>Nombre de Pompes</h3>
            <p>{pumpsCount}</p>
          </div>
        </div>

        {/* Graphiques */}
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

          <ProduitBarChart data={dataProduits} />
        </div>

        {/* Modale */}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
          <div className="printable-content">
            {/* Afficher les infos de la station en en-tête */}
            {stationData && <StationHeader stationData={stationData} />}

            {modalContent === 'Créer une Cuve' && <CreateCuve onClose={closeModal} />}
            {modalContent === 'Créer un Produit' && <CreateProduit onClose={closeModal} onAddCategory={() => {}} />}
            {modalContent === 'Ajouter un Fournisseur' && <CreateFournisseur onClose={closeModal} categories={categories} />}
            {modalContent === 'Créer une Pompe' && (
              <CreatePompe onClose={closeModal} onAddPompe={() => {}} produits={produits} cuves={cuves} />
            )}
            {modalContent === 'Ajouter un Approvisionnement' && (
              <CreateApprovisionnement onClose={closeModal} fournisseurs={fournisseurs} categories={categories} produits={produits} cuves={cuves} />
            )}
            {modalContent === 'Enrégistrer la station' && <StationForm onClose={closeModal} onSave={handleSaveStation} />}
            {modalContent === 'Ajouter un Employé' && <EmployeForm onClose={closeModal} />}
            {modalContent === 'Liste des Produits' && <ProductTable products={produits} onEditProduct={() => {}} onDeleteProduct={() => {}} onClose={closeModal} />}
            {modalContent === 'Liste des Employés' && <EmployeTable employees={employees} onEditEmployee={() => {}} onDeleteEmployee={() => {}} onClose={closeModal} />}
            {modalContent === 'Liste des Pompes' && <PompeTable pompes={pompes} onEditPompe={() => {}} onDeletePompe={() => {}} onClose={closeModal} />}
            {modalContent === 'Liste des Cuves' && <CuveTable cuves={cuves} onEditCuve={() => {}} onDeleteCuve={() => {}} onClose={closeModal} />}
            {modalContent === 'Liste des Fournisseurs' && <FournisseurTable fournisseurs={fournisseurs} onEditFournisseur={() => {}} onDeleteFournisseur={() => {}} onClose={closeModal} />}
            {modalContent === 'Liste des Approvisionnements' && <ApprovisionnementTable approvisionnements={approvisionnements} onEditApprovisionnement={() => {}} onDeleteApprovisionnement={() => {}} onClose={closeModal} />}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
