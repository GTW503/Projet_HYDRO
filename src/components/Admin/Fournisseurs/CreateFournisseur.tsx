import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './CreateFournisseur.css';
import createApiInstance from '../../../services/axiosConfig'; // Importer Axios configuré

const CreateFournisseur: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [fournisseur, setFournisseur] = useState('');
  const [adresse, setAdresse] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [categorie, setCategorie] = useState(''); // Stocker le nom de la catégorie ici
  const [livraison, setLivraison] = useState('');
  const [categories, setCategories] = useState<string[]>([]); // Récupérer les noms des catégories
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  // Instance Axios pour les fournisseurs
  const fournisseursApi = createApiInstance('admin/fournisseurs');

  // Instance Axios pour les produits (pour récupérer les catégories)
  const produitsApi = createApiInstance('admin/produits');

  const livraisonOptions = [
    'Livraison journalière',
    'Livraison mensuelle',
    'Livraison annuelle',
    'Livraison hebdomadaire',
    'Livraison sur demande',
  ];

  // Fonction pour récupérer les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      const response = await produitsApi.get('/categories.php'); // Appel à l'API pour récupérer les catégories
      if (response.data && response.data.categories) {
        const categoryNames = response.data.categories.map((cat: { nom: string }) => cat.nom);
        setCategories(categoryNames); // Stocker les noms des catégories
      } else {
        setCategories([]); // S'assurer que categories est au moins une liste vide
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      alert('Impossible de récupérer les catégories');
    }
  };

  // Charger les catégories lors du montage du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  // Gestion du changement de numéro de téléphone
  const handlePhoneChange = (value: string, country: any) => {
    setPhone(value);
    const maxLength = country.dialCode === '228' ? 8 : country.format.replace(/[^.]/g, '').length;
    const digitCount = value.replace(/[^0-9]/g, '').length - country.dialCode.length;

    if (digitCount > maxLength) {
      setPhoneError(`Le numéro de téléphone ne peut pas dépasser ${maxLength} chiffres pour ${country.name}.`);
    } else {
      setPhoneError('');
    }
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation de base
    if (!phone || phoneError || !categorie) {
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }

    // Préparer les données du formulaire
    const fournisseurData = {
      fournisseur,
      adresse,
      telephone: phone,
      email,
      categorie_produit: categorie, // Utiliser le nom de la catégorie sélectionnée
      livraison,
    };

    try {
      setLoading(true); // Activer l'indicateur de chargement
      // Envoyer les données via Axios au backend (fournisseur.php)
      const response = await fournisseursApi.post('/fournisseur.php', fournisseurData); // Utilise fournisseursApi pour soumettre les données
      console.log('Fournisseur créé avec succès:', response.data);
      setLoading(false); // Désactiver l'indicateur de chargement
      onClose(); // Fermer le formulaire après soumission
    } catch (error: any) {
      setLoading(false); // Désactiver l'indicateur de chargement en cas d'erreur
      console.error('Erreur lors de la création du fournisseur:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message : 'Erreur lors de la création du fournisseur');
    }
  };

  return (
    <div className="create-fournisseur-container">
      <button className="close-button" onClick={onClose}>
        X
      </button>
      <h2>Créer un Fournisseur</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Fournisseur:
          <input
            type="text"
            value={fournisseur}
            onChange={(e) => setFournisseur(e.target.value)}
            required
          />
        </label>
        <label>
          Adresse:
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
          />
        </label>
        <label>
          Téléphone:
          <PhoneInput
            country={'us'} // Par défaut aux États-Unis
            value={phone}
            onChange={handlePhoneChange}
            inputProps={{
              name: 'phone',
              required: true,
              autoFocus: true,
            }}
          />
          {phoneError && <span className="phone-error">{phoneError}</span>}
        </label>
        <label>
          Adresse mail:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Catégorie de produit:
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)} // Mettre à jour l'état de la catégorie sélectionnée
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            ) : (
              <option disabled>Aucune catégorie disponible</option>
            )}
          </select>
        </label>
        <label>
          Livraison:
          <select
            value={livraison}
            onChange={(e) => setLivraison(e.target.value)}
            required
          >
            <option value="">Sélectionner une option</option>
            {livraisonOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="save-button" disabled={loading}>
          {loading ? 'Enregistrement en cours...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
};

export default CreateFournisseur;
