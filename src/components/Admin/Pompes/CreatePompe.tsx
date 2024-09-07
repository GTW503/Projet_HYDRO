import React, { useState } from 'react';
import './CreatePompe.css';

interface CreatePompeProps {
  onClose: () => void;
  onAddPompe: (pompe: Pompe) => void;
  produits: string[];
  cuves: string[];
}

interface Pompe {
  nom: string;
  contenu: string;
  cuve: string;
}

const CreatePompe: React.FC<CreatePompeProps> = ({ onClose, onAddPompe, produits, cuves }) => {
  const [nom, setNom] = useState<string>('');
  const [contenu, setContenu] = useState<string>('');
  const [cuve, setCuve] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nom && contenu && cuve) {
      onAddPompe({ nom, contenu, cuve });
      onClose();
    } else {
      alert('Tous les champs sont obligatoires');
    }
  };

  return (
    <div className="create-pompe-container">
      <h2>Créer une Nouvelle Pompe</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="nom">Nom de la Pompe</label>
          <input 
            type="text" 
            id="nom" 
            value={nom} 
            onChange={(e) => setNom(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <label htmlFor="contenu">Contenu</label>
          <select 
            id="contenu" 
            value={contenu} 
            onChange={(e) => setContenu(e.target.value)} 
            required
          >
            <option value="">Sélectionnez un produit</option>
            {produits.map((produit, index) => (
              <option key={index} value={produit}>
                {produit}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="cuve">Cuve Associée</label>
          <select 
            id="cuve" 
            value={cuve} 
            onChange={(e) => setCuve(e.target.value)} 
            required
          >
            <option value="">Sélectionnez une cuve</option>
            {cuves.map((cuve, index) => (
              <option key={index} value={cuve}>
                {cuve}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose}>Annuler</button>
          <button type="submit">Créer</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePompe;
