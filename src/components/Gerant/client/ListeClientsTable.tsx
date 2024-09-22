import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ListeClientsTable.css';
import createApiInstance from '../../../services/axiosConfig';

interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
}

const ListeClientsTable: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null); // Pour gérer le mode édition
  const [updatedClient, setUpdatedClient] = useState<Client | null>(null); // Pour les modifications en temps réel
  const [confirmationDialog, setConfirmationDialog] = useState<{ open: boolean, clientId: number | null }>({ open: false, clientId: null });

  // Appeler l'API pour récupérer les clients
  useEffect(() => {
    const api = createApiInstance('gerant/client');
    api.get('/client.php')
      .then((response) => {
        setClients(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Erreur lors de la récupération des clients');
        setLoading(false);
      });
  }, []);

  // Gérer la modification des informations du client
  const handleEditClient = (client: Client) => {
    setEditingClient(client);
  };

  const handleUpdateClient = async () => {
    const api = createApiInstance('gerant/client');
    if (updatedClient) {
      try {
        await api.put('/client.php', updatedClient); // Mettre à jour le client sur le backend
        alert('Client mis à jour avec succès!');
        // Mettre à jour la liste localement
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
        setEditingClient(null); // Fermer le formulaire de modification
      } catch (err) {
        alert('Erreur lors de la mise à jour');
      }
    }
  };

  const handleDeleteClient = async (id: number) => {
    const api = createApiInstance('gerant/client');
    if (confirmationDialog.clientId === id) {
      try {
        await api.delete('/client.php', { data: { id } }); // Supprimer le client dans le backend
        alert('Client supprimé avec succès!');
        // Mettre à jour la liste localement
        setClients(clients.filter(c => c.id !== id));
        setConfirmationDialog({ open: false, clientId: null });
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const confirmDeleteClient = (id: number) => {
    setConfirmationDialog({ open: true, clientId: id });
  };

  const handleCancelDelete = () => {
    setConfirmationDialog({ open: false, clientId: null });
  };

  // Si on est en train de modifier un client, afficher le formulaire de modification
  if (editingClient) {
    return (
      <div className="edit-client-container">
        <h2>Modifier le client</h2>
        <label>
          Nom:
          <input
            type="text"
            value={updatedClient?.nom || editingClient.nom}
            onChange={(e) => setUpdatedClient({ ...editingClient, nom: e.target.value })}
          />
        </label>
        <label>
          Prénom:
          <input
            type="text"
            value={updatedClient?.prenom || editingClient.prenom}
            onChange={(e) => setUpdatedClient({ ...editingClient, prenom: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            value={updatedClient?.email || editingClient.email}
            onChange={(e) => setUpdatedClient({ ...editingClient, email: e.target.value })}
          />
        </label>
        <label>
          Téléphone:
          <input
            type="text"
            value={updatedClient?.telephone || editingClient.telephone}
            onChange={(e) => setUpdatedClient({ ...editingClient, telephone: e.target.value })}
          />
        </label>
        <div className="buttons">
          <button onClick={handleUpdateClient}>Enregistrer</button>
          <button onClick={() => setEditingClient(null)}>Annuler</button>
        </div>
      </div>
    );
  }

 // ... reste du code

// Si l'on supprime un client, afficher la confirmation
if (confirmationDialog.open) {
    return (
      <div className="confirmation-dialog">
        <p>Voulez-vous vraiment supprimer ce client?</p>
        <div className="confirmation-buttons">
          <button 
            onClick={() => handleDeleteClient(confirmationDialog.clientId as number)} 
            className="btn-confirm btn-red"
          >
            Oui
          </button>
          <button 
            onClick={handleCancelDelete} 
            className="btn-confirm btn-green"
          >
            Non
          </button>
        </div>
      </div>
    );
  }
  // Affichage de la liste des clients
  if (loading) {
    return <p>Chargement des clients...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="client-table-container">
      <h2>Liste des Clients</h2>
      <table className="client-table">
        <thead>
          <tr>
            <th>ID</th> {/* Ajout de l'ID */}
            <th>Nom</th>
            <th>Prénom</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan={6} className="no-data">Aucun client enregistré</td>
            </tr>
          ) : (
            clients.map((client, index) => (
              <tr key={client.id} className={index % 2 === 0 ? 'row-light' : 'row-dark'}>
                <td>{client.id}</td> {/* Affichage de l'ID */}
                <td>{client.nom}</td>
                <td>{client.prenom}</td>
                <td>{client.telephone}</td>
                <td>{client.email}</td>
                <td>
                  <button onClick={() => handleEditClient(client)} className="action-button edit-button">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => confirmDeleteClient(client.id)} className="action-button delete-button">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListeClientsTable;
