import React, { useState, useEffect } from 'react';
import './CreateApprovisionnement.css';

interface ApprovisionnementProps {
  onClose: () => void;
}

const CreateApprovisionnement: React.FC<ApprovisionnementProps> = ({ onClose }) => {
  const [date, setDate] = useState<string>(getTodayDate());
  const [selectedFournisseur, setSelectedFournisseur] = useState<string>('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('');
  const [selectedProduit, setSelectedProduit] = useState<string>('');
  const [stockFinal, setStockFinal] = useState<number>(0);
  const [stockArrive, setStockArrive] = useState<number>(0);
  const [melange, setMelange] = useState<number>(0);
  const [emplacement, setEmplacement] = useState<string>('');
  const [montantPayer, setMontantPayer] = useState<number>(0);
  const [stockTotal, setStockTotal] = useState<number>(0);

  useEffect(() => {
    setStockTotal(stockFinal + stockArrive);
  }, [stockArrive, stockFinal]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const approvisionnementData = {
      date,
      fournisseur: selectedFournisseur,
      categorie: selectedCategorie,
      produit: selectedProduit,
      stockArrive,
      stockFinal,
      melange,
      stockTotal,
      emplacement,
      montantPayer,
    };
    console.log(approvisionnementData);
    onClose();
  };

  function getTodayDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="create-approvisionnement-container">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Créer un Approvisionnement</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Date d'approvisionnement :
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={getTodayDate()} // Restriction sur les dates passées
            required
          />
        </label>

        {/* Fournisseur Dropdown */}
        <label>
          Fournisseur :
          <select
            value={selectedFournisseur}
            onChange={(e) => setSelectedFournisseur(e.target.value)}
            required
          >
            <option value="">Sélectionner un fournisseur</option>
            {/* Options à remplir dynamiquement par le backend */}
          </select>
        </label>

        {/* Catégorie Dropdown */}
        <label>
          Catégorie :
          <select
            value={selectedCategorie}
            onChange={(e) => setSelectedCategorie(e.target.value)}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {/* Options à remplir dynamiquement par le backend */}
          </select>
        </label>

        {/* Produit Dropdown */}
        <label>
          Produit :
          <select
            value={selectedProduit}
            onChange={(e) => setSelectedProduit(e.target.value)}
            required
          >
            <option value="">Sélectionner un produit</option>
            {/* Options à remplir dynamiquement par le backend */}
          </select>
        </label>

        {/* Stock Arrivé */}
        <label>
          Stock Arrivé :
          <input
            type="number"
            value={stockArrive}
            onChange={(e) => setStockArrive(Number(e.target.value))}
            required
          />
        </label>

        {/* Stock Final */}
        <label>
          Stock Final (avant approvisionnement) :
          <input
            type="number"
            value={stockFinal}
            onChange={(e) => setStockFinal(Number(e.target.value))}
            readOnly
          />
        </label>

        <label>
          Mélange (en unité pompe) :
          <input
            type="number"
            value={melange}
            onChange={(e) => setMelange(Number(e.target.value))}
          />
        </label>

        <label>
          Stock Total :
          <input
            type="number"
            value={stockTotal}
            readOnly
          />
        </label>

        {/* Emplacement Dropdown */}
        <label>
          Emplacement (Cuve) :
          <select
            value={emplacement}
            onChange={(e) => setEmplacement(e.target.value)}
            required
          >
            <option value="">Sélectionner un emplacement</option>
            {/* Options à remplir dynamiquement par le backend */}
          </select>
        </label>

        <label>
          Montant à Payer :
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
