import React, { useState } from 'react';
import './CreateAchat.css';

interface CreateAchatProps {
  onClose: () => void;
  onCreateAchat: (achat: any) => void;
}

const CreateAchat: React.FC<CreateAchatProps> = ({ onClose, onCreateAchat }) => {
  const [fournisseur, setFournisseur] = useState('');
  const [categorie, setCategorie] = useState('');
  const [produit, setProduit] = useState('');
  const [prix, setPrix] = useState<number | ''>('');
  const [datePaiement, setDatePaiement] = useState('');

  const handleCreate = () => {
    if (!fournisseur || !categorie || !produit || prix === '' || !datePaiement) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const achat = {
      fournisseur,
      categorie,
      produit,
      prix,
      datePaiement,
    };
    onCreateAchat(achat);
    onClose();
  };

  const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  return (
    <div className="create-achat-modal">
      <h2>Créer un Achat</h2>

      {/* Fournisseur */}
      <label htmlFor="fournisseur">Fournisseur:</label>
      <select
        id="fournisseur"
        value={fournisseur}
        onChange={(e) => setFournisseur(e.target.value)}
      >
        <option value="">Sélectionner un fournisseur</option>
        {/* The options will be populated dynamically from the backend */}
      </select>

      {/* Catégorie */}
      <label htmlFor="categorie">Catégorie:</label>
      <select
        id="categorie"
        value={categorie}
        onChange={(e) => setCategorie(e.target.value)}
      >
        <option value="">Sélectionner une catégorie</option>
        {/* The options will be populated dynamically from the backend */}
      </select>

      {/* Produit */}
      <label htmlFor="produit">Produit:</label>
      <select
        id="produit"
        value={produit}
        onChange={(e) => setProduit(e.target.value)}
      >
        <option value="">Sélectionner un produit</option>
        {/* The options will be populated dynamically from the backend */}
      </select>

      {/* Prix */}
      <label htmlFor="prix">Prix à payer:</label>
      <input
        type="number"
        id="prix"
        value={prix}
        onChange={(e) => setPrix(Number(e.target.value))}
        placeholder="Prix"
        min="0"
      />

      {/* Date de paiement */}
      <label htmlFor="datePaiement">Date de paiement:</label>
      <input
        type="date"
        id="datePaiement"
        value={datePaiement}
        onChange={(e) => setDatePaiement(e.target.value)}
        min={todayDate} // Restrict to today or future dates
      />

      {/* Buttons */}
      <div className="buttons">
        <button onClick={handleCreate}>Créer</button>
        <button onClick={onClose}>Annuler</button>
      </div>
    </div>
  );
};

export default CreateAchat;
