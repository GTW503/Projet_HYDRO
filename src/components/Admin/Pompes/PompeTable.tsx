import React, { useState, useEffect } from 'react';
import { useTable, Column, useSortBy, useGlobalFilter } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faPrint } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal'; // Pour les modales
import createApiInstance from '../../../services/axiosConfig';
import './PompeTable.css';

interface Pompe {
  id: number;
  nom: string;
  produit_stocke: string;  // Désignation du produit stocké
  cuve_associee: string;   // Nom de la cuve associée
}

const PompeTable: React.FC = () => {
  const [pompes, setPompes] = useState<Pompe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPompe, setSelectedPompe] = useState<Pompe | null>(null); // Pour la modification
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); // Pour la suppression
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // Pour l'édition
  const [pompeToDelete, setPompeToDelete] = useState<Pompe | null>(null); // Pompe à supprimer
  const [message, setMessage] = useState<string | null>(null); // Message de succès ou d'erreur
  const apiPompe = createApiInstance('admin/pompes');

  // Fonction pour récupérer les pompes
  const fetchPompes = async () => {
    try {
      const response = await apiPompe.get('/pompe.php');  // Utilisez la bonne route
      if (response.data.success) {
        setPompes(response.data.data);  // Mettre à jour les pompes
      } else {
        setError('Erreur lors de la récupération des pompes.');
      }
      setLoading(false);
    } catch (error) {
      setError('Erreur lors de la récupération des pompes.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPompes();  // Récupérer les pompes dès que le composant est monté
  }, []);

  // Ouvrir le modal de suppression
  const openDeleteModal = (pompe: Pompe) => {
    setPompeToDelete(pompe);
    setIsDeleteModalOpen(true);
  };

  // Fermer le modal de suppression
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPompeToDelete(null);
  };

  // Supprimer la pompe
  const handleDeletePompe = async () => {
    if (pompeToDelete) {
      try {
        await apiPompe.delete(`/pompe.php?id=${pompeToDelete.id}`); // Supprimer la pompe
        setPompes(pompes.filter(p => p.id !== pompeToDelete.id)); // Mettre à jour la liste des pompes
        setMessage('Pompe supprimée avec succès');
        closeDeleteModal();
      } catch (error) {
        console.error('Erreur lors de la suppression de la pompe', error);
        setMessage('Erreur lors de la suppression de la pompe');
      }
    }
  };

  // Ouvrir la modal de modification
  const handleEditPompe = (pompe: Pompe) => {
    setSelectedPompe(pompe);  // Sélectionner la pompe pour la modifier
    setIsEditModalOpen(true);
  };

  // Fermer la modal d'édition
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPompe(null);
  };

  // Soumettre la modification
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPompe) {
      try {
        await apiPompe.put(`/pompe.php`, selectedPompe); // Mettre à jour la pompe
        fetchPompes();  // Rafraîchir la liste des pompes
        setMessage('Pompe modifiée avec succès');
        closeEditModal();  // Fermer la modal
      } catch (error) {
        console.error('Erreur lors de la modification de la pompe', error);
        setMessage('Erreur lors de la modification de la pompe');
      }
    }
  };

  const columns: Column<Pompe>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Nom', accessor: 'nom' },
      { Header: 'Produit stocké', accessor: 'produit_stocke' },  // Désignation du produit stocké
      { Header: 'Cuve associée', accessor: 'cuve_associee' },   // Nom de la cuve associée
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button
              onClick={() => handleEditPompe(row.original)}
              className="action-button edit-button"
              title="Modifier la pompe"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => openDeleteModal(row.original)}
              className="action-button delete-button"
              title="Supprimer la pompe"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [pompes]
  );

  const tableInstance = useTable({ columns, data: pompes }, useGlobalFilter, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } = tableInstance;

  return (
    <div className="pompe-table-container">
      <div className="table-header">
        <h2>Liste des Pompes</h2>
        <input
          type="text"
          placeholder="Rechercher par nom, ID, etc."
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="search-input"
        />
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
        <p>Chargement des pompes...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table {...getTableProps()} className="pompe-table">
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

      {/* Modal de suppression */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        className="modal"
        contentLabel="Confirmation de la suppression"
      >
        <h2>Confirmer la suppression</h2>
        {pompeToDelete && (
          <>
            <p>Voulez-vous vraiment supprimer la pompe "{pompeToDelete.nom}" ?</p>
            <button onClick={handleDeletePompe} className="delete-button">
              Oui
            </button>
            <button onClick={closeDeleteModal} className="cancel-button">
              Non
            </button>
          </>
        )}
      </Modal>

      {/* Modal d'édition */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        className="modal"
        contentLabel="Modifier la pompe"
      >
        <h2>Modifier la Pompe</h2>
        {selectedPompe && (
          <form onSubmit={handleEditSubmit}>
            <label>
              Nom:
              <input
                type="text"
                value={selectedPompe.nom}
                onChange={(e) => setSelectedPompe({ ...selectedPompe, nom: e.target.value })}
              />
            </label>
            {/* Vous pouvez ajouter d'autres champs de sélection (produit, cuve, etc.) */}
            <button type="submit" className="save-button">Enregistrer</button>
            <button type="button" onClick={closeEditModal} className="cancel-button">Annuler</button>
          </form>
        )}
      </Modal>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PompeTable;
