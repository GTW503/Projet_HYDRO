import React, { useState, useEffect } from 'react';
import './CreateCuve.css';
import createApiInstance from '../../../services/axiosConfig'; // Importer l'instance Axios avec le bon chemin

const CreateCuve: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // États pour chaque champ du formulaire
  const [designation, setDesignation] = useState('');
  const [nom, setNom] = useState('');
  const [produitStocke, setProduitStocke] = useState<number | ''>(''); // ID du produit stocké
  const [produits, setProduits] = useState([]); // Stocker les produits récupérés
  const [capaciteStockage, setCapaciteStockage] = useState<number | ''>(''); // Capacité de stockage
  const [prixAchat, setPrixAchat] = useState<number | ''>(''); // Prix d'achat
  const [loading, setLoading] = useState(false); // Pour gérer l'état de chargement
  const [error, setError] = useState(''); // Pour afficher les erreurs

  // Création d'une instance Axios pour le sous-dossier "admin"
  const cuveApi = createApiInstance('admin/cuves'); // Pour les cuves
  const produitApi = createApiInstance('admin/produits'); // Pour les produits

  // Fonction pour récupérer les produits via une requête GET
  const fetchProduits = async () => {
    try {
      const response = await produitApi.get('/produit.php'); // Chemin correct pour accéder à produits.php
      setProduits(response.data); // Stocker les produits dans l'état
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    }
  };

  // Utiliser useEffect pour charger les produits dès que le composant est monté
  useEffect(() => {
    fetchProduits();
  }, []); // Le tableau vide [] signifie que ce useEffect s'exécute une seule fois lors du chargement du composant

  // Liste des capacités de stockage prédéfinies
  const capaciteOptions = [
    10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 70000
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification pour s'assurer que les champs numériques sont bien remplis
    if (!designation || !nom || !capaciteStockage || !prixAchat || !produitStocke) {
      setError('Veuillez remplir tous les champs correctement.');
      return;
    }

    if (prixAchat <= 0) {
      setError('Le prix d\'achat doit être supérieur à 0.');
      return;
    }

    // Réinitialiser l'erreur si tout est correct
    setError('');

    // Création de l'objet cuve avec les données du formulaire
    const cuveData = {
      designation,
      nom,
      produit_stock: produitStocke, // ID du produit sélectionné
      capacite_stock: Number(capaciteStockage), // Conversion en nombre
      prix_achat: `${Number(prixAchat)} FCFA`, // Ajouter "FCFA" au prix
    };

    try {
      setLoading(true); // Activer l'indicateur de chargement

      // Envoi des données au backend pour créer la cuve
      const response = await cuveApi.post('/create_cuve.php', cuveData); // Chemin correct pour accéder à create_cuve.php
      console.log('Réponse du serveur:', response.data);

      if (response.data.success) {
        alert('Cuve créée avec succès');
        onClose(); // Fermer le formulaire après la soumission réussie
      } else {
        setError(response.data.message || 'Erreur lors de la création de la cuve');
      }

    } catch (error) {
      console.error('Erreur lors de la création de la cuve:', error);
      setError('Erreur lors de la création de la cuve.');
    } finally {
      setLoading(false); // Désactiver l'indicateur de chargement
    }
  };

  return (
    <div className="create-cuve-container">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Créer une Cuve</h2>
      <form onSubmit={handleSubmit}>
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
          Nom:
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </label>

        <label>
          Produit stocké:
          <select
            value={produitStocke}
            onChange={(e) => setProduitStocke(Number(e.target.value))} // Assurez-vous de stocker l'ID du produit
            required
          >
            <option value="">Sélectionnez un produit</option> {/* Option par défaut */}
            {produits.map((produit: any) => (
              <option key={produit.id} value={produit.id}>
                {produit.designation} {/* Affichage de la désignation du produit */}
              </option>
            ))}
          </select>
        </label>

        <label>
          Capacité de stockage (L):
          <select
            value={capaciteStockage}
            onChange={(e) => setCapaciteStockage(Number(e.target.value))} // Assurez-vous que la valeur est un nombre
            required
          >
            <option value="">Sélectionnez une capacité</option> {/* Option par défaut */}
            {capaciteOptions.map((option) => (
              <option key={option} value={option}>
                {option} L
              </option>
            ))}
          </select>
        </label>

        <label>
          Prix d'achat (FCFA):
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              value={prixAchat}
              onChange={(e) => setPrixAchat(Number(e.target.value))}
              min="0"
              required
            />
            <span style={{ marginLeft: '8px' }}>FCFA</span> {/* Ajouter FCFA à côté */}
          </div>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateCuve;
