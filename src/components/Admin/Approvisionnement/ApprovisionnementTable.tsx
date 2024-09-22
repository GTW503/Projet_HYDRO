import React, { useState, useEffect } from 'react';
import createApiInstance from '../../../services/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './ApprovisionnementTable.css';
import Modal from 'react-modal'; // Utilisation de react-modal pour afficher les modales
import { confirmAlert } from 'react-confirm-alert'; // Bibliothèque pour confirmation
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importation des styles de la confirmation

const ApprovisionnementTable = () => {
  const [approvisionnements, setApprovisionnements] = useState([]);
  const [selectedApprovisionnement, setSelectedApprovisionnement] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false); // Contrôle de l'alerte sonore
  const [formData, setFormData] = useState({
    stockFinal: 0,
    stockArrive: 0,
    montantPayer: 0,
  }); // État pour l'édition

  const api = createApiInstance('admin/approvisionnements');

  useEffect(() => {
    const fetchApprovisionnements = async () => {
      try {
        const response = await api.get('/approvisionnements.php');
        setApprovisionnements(response.data.approvisionnements);
      } catch (error) {
        console.error('Erreur lors de la récupération des approvisionnements:', error);
      }
    };

    fetchApprovisionnements();
  }, [api]);

  // Alerte sonore si le stock final est inférieur ou égal à 50L
  useEffect(() => {
    const lowStockItems = approvisionnements.filter(approv => approv.stockFinal <= 50);
    
    if (lowStockItems.length > 0 && !soundPlayed) {
      const alertSound = new Audio('https://www.soundjay.com/button/beep-07.wav'); // Son en ligne
      alertSound.play();
      setSoundPlayed(true);
    }
  }, [approvisionnements, soundPlayed]);

  // Gestion des boutons "Détails", "Modifier", "Supprimer"
  const handleDetailClick = (approvisionnement) => {
    setSelectedApprovisionnement(approvisionnement);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (approvisionnement) => {
    setSelectedApprovisionnement(approvisionnement);
    setFormData({
      stockFinal: approvisionnement.stockFinal,
      stockArrive: approvisionnement.stockArrive,
      montantPayer: approvisionnement.montantPayer,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (approvisionnement) => {
    confirmAlert({
      title: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir supprimer cet approvisionnement?',
      buttons: [
        {
          label: 'Oui, supprimer',
          onClick: () => {
            // Effectuer la suppression ici
            setApprovisionnements(approvisionnements.filter(a => a.id !== approvisionnement.id));
          },
          className: 'btn-red' // Bouton rouge pour suppression
        },
        {
          label: 'Non, annuler',
          onClick: () => {},
          className: 'btn-green' // Bouton vert pour annuler
        }
      ]
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Logique pour soumettre le formulaire et mettre à jour l'enregistrement ici
    setIsEditModalOpen(false);
  };

  return (
    <div className="approvisionnement-table-container">
      <h2>Liste des Approvisionnements</h2>
      <table className="approvisionnement-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Fournisseur</th>
            <th>Produit</th>
            <th>Stock Final</th>
            <th>Stock Arrivé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvisionnements.map(approvisionnement => (
            <tr key={approvisionnement.id} className={approvisionnement.stockFinal <= 50 ? 'low-stock' : ''}>
              <td>{approvisionnement.date}</td>
              <td>{approvisionnement.fournisseur_nom}</td>
              <td>{approvisionnement.produit_nom}</td>
              <td>{approvisionnement.stockFinal}</td>
              <td>{approvisionnement.stockArrive}</td>
              <td>
                <button 
                  onClick={() => handleDetailClick(approvisionnement)} 
                  title="Voir les détails"
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                </button>
                <button 
                  onClick={() => handleEditClick(approvisionnement)} 
                  title="Modifier"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(approvisionnement)} 
                  title="Supprimer"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal pour les détails */}
      {selectedApprovisionnement && (
        <Modal isOpen={isDetailModalOpen} onRequestClose={() => setIsDetailModalOpen(false)}>
          <div className="a4-modal">
            <h2>Détails de l'Approvisionnement</h2>
            <p><strong>Date:</strong> {selectedApprovisionnement.date}</p>
            <p><strong>Fournisseur:</strong> {selectedApprovisionnement.fournisseur_nom}</p>
            <p><strong>Produit:</strong> {selectedApprovisionnement.produit_nom}</p>
            <p><strong>Stock Final:</strong> {selectedApprovisionnement.stockFinal}L</p>
            <p><strong>Stock Arrivé:</strong> {selectedApprovisionnement.stockArrive}L</p>
            <p><strong>Montant Payé:</strong> {selectedApprovisionnement.montantPayer}€</p>
            <button onClick={() => setIsDetailModalOpen(false)}>Fermer</button>
            <button onClick={() => window.print()}>Imprimer</button>
          </div>
        </Modal>
      )}

      {/* Modal pour modifier */}
      {selectedApprovisionnement && (
        <Modal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)}>
          <h2>Modifier l'Approvisionnement</h2>
          <form onSubmit={handleFormSubmit}>
            <label>Stock Final</label>
            <input 
              type="number" 
              name="stockFinal"
              value={formData.stockFinal} 
              onChange={handleFormChange} 
            />
            <label>Stock Arrivé</label>
            <input 
              type="number" 
              name="stockArrive"
              value={formData.stockArrive} 
              onChange={handleFormChange} 
            />
            <label>Montant Payé</label>
            <input 
              type="number" 
              name="montantPayer"
              value={formData.montantPayer} 
              onChange={handleFormChange} 
            />
            <button type="submit">Enregistrer</button>
            <button onClick={() => setIsEditModalOpen(false)}>Annuler</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ApprovisionnementTable;
