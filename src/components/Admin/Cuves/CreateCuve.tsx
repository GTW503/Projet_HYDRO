import React from 'react';
import './CreateCuve.css';

const CreateCuve: React.FC<{ onClose: () => void }> = ({ onClose }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour enregistrer les informations de la cuve
  };

  return (
    <div className="create-cuve-container">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Créer une Cuve</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Désignation:
          <input type="text" required />
        </label>
        <label>
          Nom:
          <input type="text" required />
        </label>
        <label>
          Produit stocké:
          <input type="text" required />
        </label>
        <label>
          Capacité de stockage:
          <input type="text" required />
        </label>
        <label>
          Prix d'achat:
          <input type="text" required />
        </label>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
};

export default CreateCuve;
