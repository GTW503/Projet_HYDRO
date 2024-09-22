import React, { useState, useEffect } from 'react';
import './CreateApprovisionnement.css';
import createApiInstance from '../../../services/axiosConfig';

interface ApprovisionnementProps {
  onClose: () => void;
}

const CreateApprovisionnement: React.FC<ApprovisionnementProps> = ({ onClose }) => {
  const [date, setDate] = useState('');
  const [selectedFournisseur, setSelectedFournisseur] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [selectedProduit, setSelectedProduit] = useState('');
  const [stockFinal, setStockFinal] = useState(0); // Stock final from previous approvisionnement
  const [stockArrive, setStockArrive] = useState(0); // Stock being added
  const [melange, setMelange] = useState(0);
  const [stockTotal, setStockTotal] = useState(0); // Calculated stock total
  const [selectedCuve, setSelectedCuve] = useState(''); 
  const [montantPayer, setMontantPayer] = useState(0);

  const [message, setMessage] = useState(''); 
  const [errors, setErrors] = useState({});

  const [fournisseurs, setFournisseurs] = useState<any[]>([]); // Initialiser les tableaux à des tableaux vides
  const [categories, setCategories] = useState<any[]>([]);
  const [produits, setProduits] = useState<any[]>([]);
  const [cuves, setCuves] = useState<any[]>([]);

  const api = createApiInstance('admin/approvisionnements');

  // Fetch data from the backend when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/approvisionnements.php');
        // Vérifiez que la réponse contient bien les données attendues
        if (response.data && response.data.fournisseurs && response.data.categories && response.data.produits && response.data.cuves) {
          const { fournisseurs, categories, produits, cuves } = response.data;
          setFournisseurs(fournisseurs || []);
          setCategories(categories || []);
          setProduits(produits || []);
          setCuves(cuves || []);
        } else {
          console.error('Données manquantes dans la réponse de l\'API:', response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, [api]);

  // Update stock total when stockArrive or stockFinal changes
  useEffect(() => {
    setStockTotal(stockFinal + stockArrive);
  }, [stockArrive, stockFinal]);

  // Fetch and auto-fill information when selecting a fournisseur
  useEffect(() => {
    const fetchFournisseurData = async () => {
      if (selectedFournisseur) {
        try {
          const response = await api.get(`/fournisseurs/${selectedFournisseur}`);
          const { categorie, produit, cuve, stock_final } = response.data;

          // Auto-fill category, product, cuve, and stockFinal fields
          setSelectedCategorie(categorie?.id || '');
          setSelectedProduit(produit?.id || '');
          setSelectedCuve(cuve?.id || '');
          setStockFinal(stock_final || 0); // Previous stock final becomes the new stockFinal
        } catch (error) {
          console.error('Erreur lors de la récupération des données du fournisseur:', error);
        }
      }
    };

    fetchFournisseurData();
  }, [selectedFournisseur]);

  // Validation of fields
  const validateForm = () => {
    const newErrors: any = {};

    if (!date) newErrors.date = "La date d'approvisionnement est obligatoire.";
    if (!selectedFournisseur) newErrors.fournisseur = "Veuillez sélectionner un fournisseur.";
    if (!selectedCategorie) newErrors.categorie = "Veuillez sélectionner une catégorie.";
    if (!selectedProduit) newErrors.produit = "Veuillez sélectionner un produit.";
    if (!selectedCuve) newErrors.cuve = "Veuillez sélectionner un emplacement (cuve).";
    if (stockArrive < 0) newErrors.stockArrive = "Le stock arrivé ne peut pas être négatif.";
    if (melange < 0) newErrors.melange = "Le mélange ne peut pas être négatif.";
    if (montantPayer <= 0) newErrors.montantPayer = "Le montant à payer doit être supérieur à 0.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit form and send data to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Veuillez corriger les erreurs ci-dessous.");
      return;
    }

    const approvisionnementData = {
      date,
      fournisseur: selectedFournisseur,
      categorie: selectedCategorie,
      produit: selectedProduit,
      stockFinal, 
      stockArrive, 
      melange,
      stockTotal, 
      emplacement: selectedCuve, 
      montantPayer,
    };

    console.log('Données envoyées au backend:', approvisionnementData); 
    try {
      await api.post('/approvisionnements.php', approvisionnementData);
      setMessage('Approvisionnement créé avec succès !');
      onClose();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la création de l\'approvisionnement.');
    }
  };

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="create-approvisionnement-container">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Créer un Approvisionnement</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Date d'approvisionnement:
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            min={getTodayDate()} 
            required 
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </label>

        {/* Fournisseurs */}
        <label>
          Fournisseur:
          <select
            value={selectedFournisseur}
            onChange={(e) => setSelectedFournisseur(e.target.value)}
            required
          >
            <option value="">Veuillez sélectionner un fournisseur</option>
            {fournisseurs.map((fournisseur) => (
              <option key={fournisseur.id} value={fournisseur.id}>
                {fournisseur.fournisseur}
              </option>
            ))}
          </select>
          {errors.fournisseur && <span className="error">{errors.fournisseur}</span>}
        </label>

        {/* Catégories */}
        <label>
          Catégorie:
          <select
            value={selectedCategorie}
            onChange={(e) => setSelectedCategorie(e.target.value)}
            required
          >
            <option value="">Veuillez sélectionner une catégorie</option>
            {categories.map((categorie) => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.nom}
              </option>
            ))}
          </select>
          {errors.categorie && <span className="error">{errors.categorie}</span>}
        </label>

        {/* Produits */}
        <label>
          Produit:
          <select
            value={selectedProduit}
            onChange={(e) => setSelectedProduit(e.target.value)}
            required
          >
            <option value="">Veuillez sélectionner un produit</option>
            {produits.map((produit) => (
              <option key={produit.id} value={produit.id}>
                {produit.designation}
              </option>
            ))}
          </select>
          {errors.produit && <span className="error">{errors.produit}</span>}
        </label>

        {/* Stock Final */}
        <label>
          Stock Final (avant approvisionnement):
          <input
            type="number"
            value={stockFinal}
            readOnly
          />
        </label>

        {/* Stock Arrivé */}
        <label>
          Stock Arrivé:
          <input
            type="number"
            value={stockArrive}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0) setStockArrive(value); 
            }}
            required
          />
          {errors.stockArrive && <span className="error">{errors.stockArrive}</span>}
        </label>

        {/* Mélange */}
        <label>
          Mélange (en unité pompe):
          <input
            type="number"
            value={melange}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0) setMelange(value); 
            }}
          />
          {errors.melange && <span className="error">{errors.melange}</span>}
        </label>

        {/* Stock Total */}
        <label>
          Stock Total:
          <input
            type="number"
            value={stockTotal}
            readOnly
          />
        </label>

        {/* Emplacement (Cuve) */}
        <label>
          Emplacement (Cuve):
          <select
            value={selectedCuve}
            onChange={(e) => {
              setSelectedCuve(e.target.value);  
              console.log('Selected Cuve:', e.target.value);
            }}
            required
          >
            <option value="">Veuillez sélectionner une cuve</option>
            {cuves.map((cuve) => (
              <option key={cuve.id} value={cuve.id}>
                {cuve.nom}
              </option>
            ))}
          </select>
          {errors.cuve && <span className="error">{errors.cuve}</span>}
        </label>

        {/* Montant à Payer */}
        <label>
          Montant à Payer:
          <input
            type="number"
            value={montantPayer}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0) setMontantPayer(value);
            }}
            required
          />
          {errors.montantPayer && <span className="error">{errors.montantPayer}</span>}
        </label>

        <button type="submit" className="save-button">Enregistrer</button>
      </form>
    </div>
  );
};

export default CreateApprovisionnement;
