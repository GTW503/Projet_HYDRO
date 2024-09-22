import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import createApiInstance from '../../../services/axiosConfig'; // Utiliser votre instance Axios configurée
import './CreateProduit.css';

Modal.setAppElement('#root');

const CreateProduct: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: number; nom: string; created_at: string }[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [designation, setDesignation] = useState('');
  const [prixPompe, setPrixPompe] = useState('');
  const [uniteGros, setUniteGros] = useState('');
  const [uniteDetail, setUniteDetail] = useState('');
  const [capacite, setCapacite] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const api = createApiInstance('admin/produits');

  // Fonction pour récupérer les catégories existantes
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories.php');
      console.log('Response data:', response.data); // Vérifier la structure des catégories

      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data.categories) {
        setCategories(response.data.categories);
      } else {
        console.error('Structure inattendue de la réponse:', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories', error);
    }
  };

  // Charger les catégories au montage du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  // Ouvrir le modal pour ajouter une nouvelle catégorie
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Fermer le modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Ajouter une nouvelle catégorie
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      console.error("Le champ 'Nom de la catégorie' est vide.");
      return;
    }

    try {
      console.log("Envoi de la nouvelle catégorie:", newCategory); // Vérification avant l'envoi

      const response = await api.post('/categories.php', { nom: newCategory });
      console.log('Add category response:', response.data); // Voir la réponse du serveur

      if (response.data.message === 'Catégorie créée avec succès') {
        // Ajouter la nouvelle catégorie à la liste des catégories
        setCategories([...categories, { id: response.data.id, nom: newCategory, created_at: new Date().toISOString() }]);
        setNewCategory(''); // Réinitialiser le champ de la nouvelle catégorie
        closeModal(); // Fermer le modal après ajout
      } else {
        console.error('Erreur lors de la création de la catégorie:', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie', error);
    }
  };

  // Ajouter un nouveau produit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/produit.php', {
        designation,
        prix_pompe: parseFloat(prixPompe),
        unite_gros: uniteGros,
        unite_detail: uniteDetail,
        capacite,
        categorie_nom: selectedCategory, // Envoyer le nom de la catégorie sélectionnée
      });
      if (response.data.message === 'Produit et catégorie créés avec succès') {
        alert('Produit ajouté avec succès');
        onClose(); // Fermer le formulaire après la création du produit
      }
    } catch (error) {
      console.error('Erreur lors de la création du produit', error);
    }
  };

  const units = [
    'Litre', 'Bidon', 'Bidon GM', 'Baril', 'Sachet', 'Sacs', 'Carton', 'Pièces', 'KG', 'Gr', 'Mètre', 'M2', 'M3'
  ];

  return (
    <div className="create-product-container">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Créer un Produit</h2>
      <form onSubmit={handleAddProduct}>
        <label>
          Désignation:
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
          />
        </label>
        <label>
          Prix Pompe:
          <input
            type="text"
            value={prixPompe}
            onChange={(e) => setPrixPompe(e.target.value)}
            required
          />
        </label>
        <label>
          Catégorie:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.nom}>{category.nom}</option>
            ))}
          </select>
        </label>
        <button type="button" className="add-category-button" onClick={openModal}>
          Ajouter une catégorie
        </button>
        <label>
          Unité en Gros:
          <select
            value={uniteGros}
            onChange={(e) => setUniteGros(e.target.value)}
            required
          >
            <option value="">Sélectionner une unité</option>
            {units.map((unit, index) => (
              <option key={index} value={unit}>{unit}</option>
            ))}
          </select>
        </label>
        <label>
          Unité Détail:
          <select
            value={uniteDetail}
            onChange={(e) => setUniteDetail(e.target.value)}
            required
          >
            <option value="">Sélectionner une unité</option>
            {units.map((unit, index) => (
              <option key={index} value={unit}>{unit}</option>
            ))}
          </select>
        </label>
        <label>
          Capacité:
          <input
            type="text"
            value={capacite}
            onChange={(e) => setCapacite(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="save-button">Enregistrer</button>
      </form>

      {/* Modal pour ajouter une catégorie */}
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
