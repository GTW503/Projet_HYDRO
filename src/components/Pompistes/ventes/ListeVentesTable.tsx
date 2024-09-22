import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ListeVentesTable.css'; // Assurez-vous de créer et d'utiliser ce fichier CSS

interface Vente {
  id: number;
  client: string;
  produit: string;
  categorie: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
}

interface ListeVentesTableProps {
  ventes: Vente[];
  onEditVente: (vente: Vente) => void;
  onDeleteVente: (id: number) => void;
}

const ListeVentesTable: React.FC<ListeVentesTableProps> = ({ ventes, onEditVente, onDeleteVente }) => {
  return (
    <div className="vente-table-container">
      <h2>Liste des Ventes</h2>
      <table className="vente-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Produit</th>
            <th>Catégorie</th>
            <th>Quantité</th>
            <th>Prix Unitaire</th>
            <th>Prix Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ventes.length === 0 ? (
            <tr>
              <td colSpan={8} className="no-data">Aucune vente enregistrée</td>
            </tr>
          ) : (
            ventes.map((vente, index) => (
              <tr key={vente.id} className={index % 2 === 0 ? 'row-light' : 'row-dark'}>
                <td>{vente.id}</td>
                <td>{vente.client}</td>
                <td>{vente.produit}</td>
                <td>{vente.categorie}</td>
                <td>{vente.quantite}</td>
                <td>{vente.prixUnitaire} €</td>
                <td>{vente.prixTotal} €</td>
                <td>
                  <button onClick={() => onEditVente(vente)} className="action-button edit-button">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => onDeleteVente(vente.id)} className="action-button delete-button">
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

export default ListeVentesTable;
