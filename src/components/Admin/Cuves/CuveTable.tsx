import React, { useState, useEffect } from 'react';
import { useTable, Column, useSortBy } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faPrint } from '@fortawesome/free-solid-svg-icons';
import createApiInstance from '../../../services/axiosConfig';
import Modal from 'react-modal';
import './CuveTable.css';

interface Cuve {
  id: number;
  designation: string;
  nom: string;
  produit_nom: string;  // Nom du produit stocké
  capacite_stock: string;  // Champ correct de la base de données
  prix_achat: string;
}

const CuveTable: React.FC = () => {
  const [cuves, setCuves] = useState<Cuve[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCuve, setSelectedCuve] = useState<Cuve | null>(null);

  const api = createApiInstance('admin/cuves');

  // Fonction pour récupérer les cuves via une requête GET
  const fetchCuves = async () => {
    try {
      const response = await api.get('/create_cuve.php');
      
      if (response.data.success && response.data.data) {
        setCuves(response.data.data);  // Utilisez 'data' pour stocker les cuves
        setLoading(false);
      } else {
        setError('Erreur lors de la récupération des cuves.');
        setLoading(false);
      }
    } catch (error) {
      setError('Erreur lors de la récupération des cuves.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuves();
  }, []);

  // Ouvrir le modal de modification
  const openEditModal = (cuve: Cuve) => {
    setSelectedCuve(cuve);
    setIsEditModalOpen(true);
  };

  // Fermer le modal de modification
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCuve(null);
  };

  // Soumettre les modifications de la cuve
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCuve) {
      try {
        const response = await api.put(`/create_cuve.php`, selectedCuve);
        if (response.data.message === 'Cuve mise à jour avec succès') {
          fetchCuves();
          closeEditModal();
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la cuve', error);
      }
    }
  };

  // Ouvrir le modal de suppression
  const openDeleteModal = (cuve: Cuve) => {
    setSelectedCuve(cuve);
    setIsDeleteModalOpen(true);
  };

  // Fermer le modal de suppression
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCuve(null);
  };

  // Supprimer la cuve sélectionnée
  const handleDelete = async () => {
    if (selectedCuve) {
      try {
        const response = await api.delete(`/create_cuve.php`, { data: { id: selectedCuve.id } });
        if (response.data.message === 'Cuve supprimée avec succès') {
          fetchCuves();
          closeDeleteModal();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de la cuve', error);
      }
    }
  };

  const columns: Column<Cuve>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Désignation', accessor: 'designation' },
      { Header: 'Nom', accessor: 'nom' },
      { Header: 'Produit stocké', accessor: 'produit_nom' },  // Affiche le nom du produit
      { Header: 'Capacité (L)', accessor: 'capacite_stock' },  // Correction pour utiliser capacite_stock
      { Header: 'Prix d\'achat (FCFA)', accessor: 'prix_achat' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button
              onClick={() => openEditModal(row.original)}
              className="action-button edit-button"
              title="Modifier cette cuve" // Ajout du titre pour l'action de modification
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => openDeleteModal(row.original)}
              className="action-button delete-button"
              title="Supprimer cette cuve" // Ajout du titre pour l'action de suppression
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      }      
    ],
    []
  );

  const tableInstance = useTable({ columns, data: cuves }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <div className="cuve-table-container">
      <div className="table-header">
        <h2>Liste des Cuves</h2>
        <div className="table-header-actions">
          <button onClick={() => window.print()} className="print-button">
            <FontAwesomeIcon icon={faPrint} /> Imprimer
          </button>
          <button className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      {loading ? (
        <p>Chargement des cuves...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table {...getTableProps()} className="cuve-table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Modal d'édition */}
      <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal} className="modal">
        <h2>Modifier la cuve</h2>
        {selectedCuve && (
          <form onSubmit={handleEditSubmit}>
            <label>
              Désignation:
              <input
                type="text"
                value={selectedCuve.designation}
                onChange={(e) =>
                  setSelectedCuve({ ...selectedCuve, designation: e.target.value })
                }
                required
              />
            </label>
            <label>
              Nom:
              <input
                type="text"
                value={selectedCuve.nom}
                onChange={(e) =>
                  setSelectedCuve({ ...selectedCuve, nom: e.target.value })
                }
                required
              />
            </label>
            <label>
              Produit stocké:
              <input
                type="text"
                value={selectedCuve.produit_nom}
                onChange={(e) =>
                  setSelectedCuve({ ...selectedCuve, produit_nom: e.target.value })
                }
                required
              />
            </label>
            <label>
              Capacité:
              <input
                type="text"
                value={selectedCuve.capacite_stock}
                onChange={(e) =>
                  setSelectedCuve({ ...selectedCuve, capacite_stock: e.target.value })
                }
                required
              />
            </label>
            <label>
              Prix d'achat:
              <input
                type="text"
                value={selectedCuve.prix_achat}
                onChange={(e) =>
                  setSelectedCuve({ ...selectedCuve, prix_achat: e.target.value })
                }
                required
              />
            </label>
            <button type="submit" className="save-button">Enregistrer</button>
            <button type="button" onClick={closeEditModal} className="cancel-button">Annuler</button>
          </form>
        )}
      </Modal>

      {/* Modal de suppression */}
      <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal} className="modal">
        <h2>Confirmer la suppression</h2>
        {selectedCuve && (
          <>
            <p>Voulez-vous vraiment supprimer la cuve "{selectedCuve.designation}" ?</p>
            <button onClick={handleDelete} className="delete-button" style={{ backgroundColor: 'red' }}>
              Oui
            </button>
            <button onClick={closeDeleteModal} className="cancel-button" style={{ backgroundColor: 'green' }}>
              Non
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default CuveTable;
