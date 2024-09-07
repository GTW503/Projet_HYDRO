import React, { useState, useEffect } from 'react';
import './CreateApprovisionnement.css';

interface ApprovisionnementProps {
  onClose: () => void;
  fournisseurs: string[];
  categories: string[];
  produits: string[];
  cuves: string[];
}

const CreateApprovisionnement: React.FC<ApprovisionnementProps> = ({ onClose, fournisseurs, categories, produits, cuves }) => {
  const [date, setDate] = useState('');
  const [selectedFournisseur, setSelectedFournisseur] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [selectedProduit, setSelectedProduit] = useState('');
  const [stockFinal, setStockFinal] = useState(0);
  const [stockArrive, setStockArrive] = useState(0);
  const [melange, setMelange] = useState(0);
  const [emplacement, setEmplacement] = useState('');
  const [montantPayer, setMontantPayer] = useState(0);
  const [stockTotal, setStockTotal] = useState(0);

  useEffect(() => {
    setStockTotal(stockFinal + stockArrive);
  }, [stockArrive, stockFinal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const approvisionnementData = {
      date,
      fournisseur: selectedFournisseur,
      categorie: selectedCategorie,
      produit: selectedProduit,
      stockFinal,
      stockArrive,
      melange,
      stockTotal,
      emplacement,
      montantPayer,
    };
    console.log(approvisionnementData);
    onClose();
  };

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="create-approvisionnement-container">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Créer un Approvisionnement</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Date d'approvisionnement:
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            min={getTodayDate()} // Restrict past dates
            required 
          />
        </label>
        <label>
          Fournisseur:
          <input
            type="text"
            list="fournisseurs-list"
            value={selectedFournisseur}
            onChange={(e) => setSelectedFournisseur(e.target.value)}
            required
          />
          <datalist id="fournisseurs-list">
            {fournisseurs.map((fournisseur, index) => (
              <option key={index} value={fournisseur} />
            ))}
          </datalist>
        </label>
        <label>
          Catégorie:
          <input
            type="text"
            list="categories-list"
            value={selectedCategorie}
            onChange={(e) => setSelectedCategorie(e.target.value)}
            required
          />
          <datalist id="categories-list">
            {categories.map((categorie, index) => (
              <option key={index} value={categorie} />
            ))}
          </datalist>
        </label>
        <label>
          Produit:
          <input
            type="text"
            list="produits-list"
            value={selectedProduit}
            onChange={(e) => setSelectedProduit(e.target.value)}
            required
          />
          <datalist id="produits-list">
            {produits.map((produit, index) => (
              <option key={index} value={produit} />
            ))}
          </datalist>
        </label>
        <label>
          Stock Final (avant approvisionnement):
          <input
            type="number"
            value={stockFinal}
            onChange={(e) => setStockFinal(Number(e.target.value))}
            readOnly
          />
        </label>
        <label>
          Stock Arrivé:
          <input
            type="number"
            value={stockArrive}
            onChange={(e) => setStockArrive(Number(e.target.value))}
            required
          />
        </label>
        <label>
          Mélange (en unité pompe):
          <input
            type="number"
            value={melange}
            onChange={(e) => setMelange(Number(e.target.value))}
          />
        </label>
        <label>
          Stock Total:
          <input
            type="number"
            value={stockTotal}
            readOnly
          />
        </label>
        <label>
          Emplacement (Cuve):
          <input
            type="text"
            list="cuves-list"
            value={emplacement}
            onChange={(e) => setEmplacement(e.target.value)}
            required
          />
          <datalist id="cuves-list">
            {cuves.map((cuve, index) => (
              <option key={index} value={cuve} />
            ))}
          </datalist>
        </label>
        <label>
          Montant à Payer:
          <input
            type="number"
            value={montantPayer}
            onChange={(e) => setMontantPayer(Number(e.target.value))}
            required
          />
        </label>
        <button type="submit" className="save-button">Enregistrer</button>
      </form>
    </div>
  );
};

export default CreateApprovisionnement;
