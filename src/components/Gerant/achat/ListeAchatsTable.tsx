import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ListeAchatsTable.css'; // Assurez-vous de créer et d'utiliser ce fichier CSS

interface Achat {
  id: number;
  fournisseur: string;
  produit: string;
  categorie: string;
  prix: number;
  datePaiement: string;
}

interface ListeAchatsTableProps {
  achats: Achat[];
  onEditAchat: (achat: Achat) => void;
  onDeleteAchat: (id: number) => void;
}

const ListeAchatsTable: React.FC<ListeAchatsTableProps> = ({ achats, onEditAchat, onDeleteAchat }) => {
  return (
    <div className="achat-table-container">
      <h2>Liste des Achats</h2>
      <table className="achat-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fournisseur</th>
            <th>Produit</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Date de Paiement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {achats.length === 0 ? (
            <tr>
              <td colSpan={7} className="no-data">Aucun achat enregistré</td>
            </tr>
          ) : (
            achats.map((achat, index) => (
              <tr key={achat.id} className={index % 2 === 0 ? 'row-light' : 'row-dark'}>
                <td>{achat.id}</td>
                <td>{achat.fournisseur}</td>
                <td>{achat.produit}</td>
                <td>{achat.categorie}</td>
                <td>{achat.prix} €</td>
                <td>{achat.datePaiement}</td>
                <td>
                  <button onClick={() => onEditAchat(achat)} className="action-button edit-button">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => onDeleteAchat(achat.id)} className="action-button delete-button">
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

export default ListeAchatsTable;
