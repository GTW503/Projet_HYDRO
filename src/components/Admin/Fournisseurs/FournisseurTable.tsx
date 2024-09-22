import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPrint, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import './FournisseurTable.css'; // Importez le fichier CSS
import createApiInstance from '../../../services/axiosConfig'; // Importez la configuration Axios

interface Fournisseur {
  id: number;
  fournisseur: string;
  adresse: string;
  telephone: string;
  email: string;
  categorie_produit: string; // Assurez-vous d'utiliser categorie_produit
  livraison: string;
}

interface FournisseurTableProps {
  onClose: () => void;
}

const FournisseurTable: React.FC<FournisseurTableProps> = ({ onClose }) => {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState<Fournisseur | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{ open: boolean, fournisseurId: number | null }>({
    open: false,
    fournisseurId: null,
  });

  // Fonction pour imprimer la fenêtre des détails
  const handlePrint = () => {
    if (showDetails) {
      const printContent = document.getElementById('printable-area');
      const newWindow = window.open('', '', 'height=500,width=800');
      newWindow?.document.write(printContent?.innerHTML || '');
      newWindow?.document.close();
      newWindow?.print();
    }
  };

  // Récupération des fournisseurs lors du chargement du composant
  useEffect(() => {
    const api = createApiInstance('admin/fournisseurs');
    const fetchFournisseurs = async () => {
      try {
        const response = await api.get('/fournisseur.php');
        
        if (response.data) {
          setFournisseurs(response.data); // Assurez-vous que les données sont bien reçues
        } else {
          setFournisseurs([]); // Par défaut, un tableau vide si pas de données
        }
        
        setLoading(false);
      } catch (error) {
        setError('Erreur lors de la récupération des fournisseurs');
        setLoading(false);
      }
    };
    fetchFournisseurs();
  }, []);

  // Ouvrir la modale d'édition
  const handleEdit = (fournisseur: Fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setShowEditModal(true);
  };

  // Enregistrer les modifications après l'édition
  const handleSaveEdit = (updatedFournisseur: Fournisseur) => {
    setFournisseurs(fournisseurs.map(f => f.id === updatedFournisseur.id ? updatedFournisseur : f));
    setShowEditModal(false);
    alert('Fournisseur modifié avec succès');
  };

  // Ouvrir la modale de confirmation pour la suppression
  const handleDeleteConfirmation = (id: number) => {
    setShowDeleteModal({ open: true, fournisseurId: id });
  };

  // Supprimer un fournisseur
  const handleDelete = () => {
    const fournisseurId = showDeleteModal.fournisseurId!;
    setFournisseurs(fournisseurs.filter(f => f.id !== fournisseurId));
    setShowDeleteModal({ open: false, fournisseurId: null });
    alert('Fournisseur supprimé avec succès');
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setShowDeleteModal({ open: false, fournisseurId: null });
  };

  // Afficher ou masquer les détails d'un fournisseur
  const toggleDetails = (fournisseur: Fournisseur) => {
    setShowDetails(showDetails === fournisseur ? null : fournisseur);
  };

  // Rendu conditionnel en fonction du chargement ou des erreurs
  if (loading) return <p>Chargement des fournisseurs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="fournisseur-table-container">
      <div className="table-header">
        <h2>Liste des Fournisseurs</h2>
        <div className="table-header-actions">
          <button onClick={handlePrint} className="print-button">
            <FontAwesomeIcon icon={faPrint} /> Imprimer
          </button>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      <table className="fournisseur-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fournisseur</th>
            <th>Adresse</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fournisseurs.length > 0 ? (
            fournisseurs.map(fournisseur => (
              <React.Fragment key={fournisseur.id}>
                <tr>
                  <td>{fournisseur.id}</td>
                  <td>{fournisseur.fournisseur}</td>
                  <td>{fournisseur.adresse}</td>
                  <td>{fournisseur.telephone}</td>
                  <td>{fournisseur.email}</td>
                  <td>
                    <button title="Détails" onClick={() => toggleDetails(fournisseur)} className="action-button">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button title="Modifier" onClick={() => handleEdit(fournisseur)} className="action-button edit-button">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button title="Supprimer" onClick={() => handleDeleteConfirmation(fournisseur.id)} className="action-button delete-button">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
                {showDetails === fournisseur && (
                  <tr>
                    <td colSpan={6} className="details-row">
                      <div id="printable-area">
                        <h3>Détails du Fournisseur</h3>
                        <p><strong>Fournisseur :</strong> {fournisseur.fournisseur}</p>
                        <p><strong>Adresse :</strong> {fournisseur.adresse}</p>
                        <p><strong>Téléphone :</strong> {fournisseur.telephone}</p>
                        <p><strong>Email :</strong> {fournisseur.email}</p>
                        <p><strong>Catégorie Produit :</strong> {fournisseur.categorie_produit}</p>
                        <p><strong>Livraison :</strong> {fournisseur.livraison}</p>
                        <button onClick={handlePrint} className="print-button">
                          <FontAwesomeIcon icon={faPrint} /> Imprimer cette feuille
                        </button>
                        <button onClick={() => setShowDetails(null)} className="close-button">
                          Fermer
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                Aucun fournisseur disponible.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modale d'édition */}
      {showEditModal && selectedFournisseur && (
        <div className="modal">
          <div className="modal-content">
            <h3>Modifier le Fournisseur</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit(selectedFournisseur);
              }}
            >
              <label>Fournisseur</label>
              <input
                type="text"
                value={selectedFournisseur.fournisseur}
                onChange={(e) => setSelectedFournisseur({ ...selectedFournisseur, fournisseur: e.target.value })}
              />
              <label>Adresse</label>
              <input
                type="text"
                value={selectedFournisseur.adresse}
                onChange={(e) => setSelectedFournisseur({ ...selectedFournisseur, adresse: e.target.value })}
              />
              <label>Téléphone</label>
              <input
                type="text"
                value={selectedFournisseur.telephone}
                onChange={(e) => setSelectedFournisseur({ ...selectedFournisseur, telephone: e.target.value })}
              />
              <label>Email</label>
              <input
                type="email"
                value={selectedFournisseur.email}
                onChange={(e) => setSelectedFournisseur({ ...selectedFournisseur, email: e.target.value })}
              />
              <label>Catégorie Produit</label>
              <input
                type="text"
                value={selectedFournisseur.categorie_produit}
                onChange={(e) => setSelectedFournisseur({ ...selectedFournisseur, categorie_produit: e.target.value })}
              />
              <label>Livraison</label>
              <input
                type="text"
                value={selectedFournisseur.livraison}
                onChange={(e) => setSelectedFournisseur({ ...selectedFournisseur, livraison: e.target.value })}
              />
              <div className="modal-buttons">
                <button type="submit" className="btn-save">Enregistrer</button>
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale de confirmation de suppression */}
      {showDeleteModal.open && (
        <div className="modal">
          <div className="modal-content confirmation-dialog">
            <p>Voulez-vous vraiment supprimer le fournisseur <strong>{fournisseurs.find(f => f.id === showDeleteModal.fournisseurId)?.fournisseur}</strong> ?</p>
            <div className="confirmation-buttons">
              <button onClick={handleDelete} className="btn-confirm btn-red">Oui</button>
              <button onClick={handleCancelDelete} className="btn-confirm btn-green">Non</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FournisseurTable;
