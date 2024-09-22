import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ListeApprovisionnementsTable.css'; // Assurez-vous de créer et d'utiliser ce fichier CSS

interface Approvisionnement {
  id: number;
  fournisseur: string;
  categorie: string;
  produit: string;
  stockArrive: number;
  stockTotal: number;
  montantPayer: number;
  emplacement: string;
}

interface ListeApprovisionnementsTableProps {
  approvisionnements: Approvisionnement[];
  onEditApprovisionnement: (approvisionnement: Approvisionnement) => void;
  onDeleteApprovisionnement: (id: number) => void;
}

const ListeApprovisionnementsTable: React.FC<ListeApprovisionnementsTableProps> = ({ approvisionnements, onEditApprovisionnement, onDeleteApprovisionnement }) => {
  return (
    <div className="approvisionnement-table-container">
      <h2>Liste des Approvisionnements</h2>
      <table className="approvisionnement-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fournisseur</th>
            <th>Catégorie</th>
            <th>Produit</th>
            <th>Stock Arrivé</th>
            <th>Stock Total</th>
            <th>Montant à Payer</th>
            <th>Emplacement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvisionnements.length === 0 ? (
            <tr>
              <td colSpan={9} className="no-data">Aucun approvisionnement enregistré</td>
            </tr>
          ) : (
            approvisionnements.map((approvisionnement, index) => (
              <tr key={approvisionnement.id} className={index % 2 === 0 ? 'row-light' : 'row-dark'}>
                <td>{approvisionnement.id}</td>
                <td>{approvisionnement.fournisseur}</td>
                <td>{approvisionnement.categorie}</td>
                <td>{approvisionnement.produit}</td>
                <td>{approvisionnement.stockArrive}</td>
                <td>{approvisionnement.stockTotal}</td>
                <td>{approvisionnement.montantPayer} €</td>
                <td>{approvisionnement.emplacement}</td>
                <td>
                  <button onClick={() => onEditApprovisionnement(approvisionnement)} className="action-button edit-button">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => onDeleteApprovisionnement(approvisionnement.id)} className="action-button delete-button">
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

export default ListeApprovisionnementsTable;
