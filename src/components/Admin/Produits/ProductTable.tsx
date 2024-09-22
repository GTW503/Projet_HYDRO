import React, { useState, useEffect } from 'react'; // Ajout de useEffect ici
import Modal from 'react-modal';
import { useTable, Column, useSortBy, useGlobalFilter } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faPrint } from '@fortawesome/free-solid-svg-icons';
import createApiInstance from '../../../services/axiosConfig';
import './ProductTable.css';

Modal.setAppElement('#root');

interface Product {
  id: number;
  designation: string;
  prix_pompe: number;
  nom: string; // Nom de la catégorie
  unite_gros: string;
  unite_detail: string;
  capacite: number;
}

interface ProductTableProps {
  onClose: () => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; nom: string }[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const api = createApiInstance('admin/produits');

  // Fonction pour récupérer les produits
  const fetchProducts = async () => {
    try {
      const response = await api.get('/produit.php');
      if (response.data) {
        setProducts(response.data);
        setLoading(false);
      }
    } catch (err) {
      setError('Erreur lors de la récupération des produits.');
      setLoading(false);
    }
  };

  // Fonction pour récupérer les catégories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories.php');
      if (response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des catégories', err);
    }
  };

  // Charger les produits et les catégories lors du premier rendu
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Reste du code...

  // Ouvrir le modal d'édition
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Fermer le modal d'édition
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Ouvrir le modal de suppression
  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Fermer le modal de suppression
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Soumettre la modification du produit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      try {
        const response = await api.put('/produit.php', selectedProduct);
        if (response.data.message === 'Produit mis à jour avec succès') {
          fetchProducts(); // Actualiser les produits après la modification
          closeEditModal();
        }
      } catch (error) {
        console.error('Erreur lors de la modification du produit', error);
      }
    }
  };

  // Supprimer le produit
  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        const response = await api.delete('/produit.php', { data: { id: selectedProduct.id } });
        if (response.data.message === 'Produit supprimé avec succès') {
          fetchProducts(); // Actualiser les produits après la suppression
          closeDeleteModal();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du produit', error);
      }
    }
  };

  const columns: Column<Product>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Désignation', accessor: 'designation' },
      { Header: 'Prix Pompe', accessor: 'prix_pompe' },
      { Header: 'Catégorie', accessor: 'nom' }, // Utilisation du nom de la catégorie
      { Header: 'Unité Gros', accessor: 'unite_gros' },
      { Header: 'Unité Détail', accessor: 'unite_detail' },
      { Header: 'Capacité', accessor: 'capacite' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => openEditModal(row.original)} className="action-button edit">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => openDeleteModal(row.original)} className="action-button delete">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },      
    ],
    []
  );

  const tableInstance = useTable({ columns, data: products }, useGlobalFilter, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } = tableInstance;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setGlobalFilter(e.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="product-table-container">
      <div className="table-header">
        <h2>Liste des Produits</h2>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Rechercher..."
          className="search-input"
        />
        <div className="table-header-actions">
          <button onClick={handlePrint} className="print-button">
            <FontAwesomeIcon icon={faPrint} /> Imprimer
          </button>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      {loading ? (
        <p>Chargement des produits...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table {...getTableProps()} className="product-table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
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
        <h2>Modifier le produit</h2>
        {selectedProduct && (
          <form onSubmit={handleEditSubmit}>
            <label>
              Désignation:
              <input
                type="text"
                value={selectedProduct.designation}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, designation: e.target.value })
                }
                required
              />
            </label>
            <label>
              Prix Pompe:
              <input
                type="number"
                value={selectedProduct.prix_pompe}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, prix_pompe: parseFloat(e.target.value) })
                }
                required
              />
            </label>
            <label>
              Catégorie:
              <select
                value={selectedProduct.nom} // Nom de la catégorie
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, nom: e.target.value })
                }
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.nom}>
                    {category.nom}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Unité Gros:
              <input
                type="text"
                value={selectedProduct.unite_gros}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, unite_gros: e.target.value })
                }
                required
              />
            </label>
            <label>
              Unité Détail:
              <input
                type="text"
                value={selectedProduct.unite_detail}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, unite_detail: e.target.value })
                }
                required
              />
            </label>
            <label>
              Capacité:
              <input
                type="number"
                value={selectedProduct.capacite}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, capacite: parseFloat(e.target.value) })
                }
                required
              />
            </label>
            <button type="submit" className="save-button">
              Enregistrer
            </button>
            <button type="button" onClick={closeEditModal} className="cancel-button">
              Annuler
            </button>
          </form>
        )}
      </Modal>

      {/* Modal de suppression */}
      <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal} className="modal">
  <h2>Confirmer la suppression</h2>
  {selectedProduct && (
    <>
      <p>Voulez-vous vraiment supprimer le produit "{selectedProduct.designation}" ?</p>
      <div className="modal-buttons">
        <button onClick={handleDelete} className="delete-button">
          Oui
        </button>
        <button onClick={closeDeleteModal} className="cancel-button">
          Non
        </button>
      </div>
    </>
  )}
</Modal>


    </div>
  );
};

export default ProductTable;
