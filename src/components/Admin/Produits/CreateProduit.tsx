import React, { useState } from 'react';
import Modal from 'react-modal';
import './CreateProduit.css';

Modal.setAppElement('#root');

const CreateProduct: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleAddCategory = () => {
    setCategories([...categories, newCategory]);
    setNewCategory('');
    closeModal();
  };

  const units = [
    'Litre', 'Bidon', 'Bidon GM', 'Baril', 'Sachet', 'Sacs', 'Carton', 'Pièces', 'KG', 'Gr', 'Mètre', 'M2', 'M3'
  ];

  return (
    <div className="create-product-container">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Créer un Produit</h2>
      <form>
        <label>
          Désignation:
          <input type="text" required />
        </label>
        <label>
          Prix Pompe:
          <input type="text" required />
        </label>
        <label>
          Catégorie:
          <select required>
            <option value="">Sélectionner une catégorie</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <button type="button" className="add-category-button" onClick={openModal}>
          Ajouter une catégorie
        </button>
        <label>
          Unité en Gros:
          <select required>
            <option value="">Sélectionner une unité</option>
            {units.map((unit, index) => (
              <option key={index} value={unit}>{unit}</option>
            ))}
          </select>
        </label>
        <label>
          Unité Détail:
          <select required>
            <option value="">Sélectionner une unité</option>
            {units.map((unit, index) => (
              <option key={index} value={unit}>{unit}</option>
            ))}
          </select>
        </label>
        <label>
          Capacité:
          <input type="text" required />
        </label>
        <button type="submit" className="save-button">Enregistrer</button>
      </form>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>Ajouter une Catégorie</h2>
        <label>
          Nom de la Catégorie:
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
        </label>
        <button onClick={handleAddCategory} className="save-category-button">
          Ajouter
        </button>
      </Modal>
    </div>
  );
};

export default CreateProduct;
