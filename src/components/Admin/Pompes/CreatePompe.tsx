import React, { useEffect, useState } from 'react';
import './CreatePompe.css';
import createApiInstance from '../../../services/axiosConfig';

interface CreatePompeProps {
  onClose: () => void;
  onAddPompe: (pompe: Pompe) => void;
}

interface Pompe {
  nom: string;
  contenu: string;
  cuve: number; // Utilisez l'ID de la cuve sélectionnée
}

const CreatePompe: React.FC<CreatePompeProps> = ({ onClose, onAddPompe }) => {
  const [nom, setNom] = useState<string>('');
  const [contenu, setContenu] = useState<string>('');
  const [cuve, setCuve] = useState<number | ''>(''); // ID de la cuve sélectionnée
  const [produits, setProduits] = useState<{ id: number; designation: string }[]>([]);
  const [cuves, setCuves] = useState<{ id: number; designation: string; produit_stocke: string; capacite: number; prix_achat: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const apiPompe = createApiInstance('admin/pompes');
  const apiProduits = createApiInstance('admin/produits');
  const apiCuves = createApiInstance('admin/cuves');

  // Fonction pour récupérer les produits
  const fetchProduits = async () => {
    try {
      const response = await apiProduits.get('/produit.php');
      console.log('Réponse produits:', response.data); // Ajoutez ce log
      setProduits(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };
  
  // Fonction pour récupérer les cuves
  const fetchCuves = async () => {
    try {
      const response = await apiCuves.get('/create_cuve.php');
      
      console.log('Réponse cuves:', response.data);  // Affiche la réponse pour voir la structure
      setCuves(response.data.data);  // Accédez à data qui contient le tableau des cuves
    } catch (error) {
      console.error('Erreur lors du chargement des cuves:', error);
    }
  };  
  
  useEffect(() => {
    fetchProduits(); // Charger la liste des produits
    fetchCuves(); // Charger la liste des cuves
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom || !contenu || !cuve) {
      alert('Veuillez remplir tous les champs avant de soumettre.');
      return;
    }

    const pompeData: Pompe = { nom, contenu, cuve: Number(cuve) }; // Convertir cuve en numéro

    try {
      setLoading(true);
      const response = await apiPompe.post('/pompe.php', pompeData); // Appel à l'API pour créer une pompe
      onAddPompe(response.data);
      setLoading(false);
      onClose(); // Fermer le formulaire après la création réussie
    } catch (error: any) {
      setLoading(false);
      console.error('Erreur lors de la création de la pompe:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message : 'Erreur lors de la création de la pompe');
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
          <label htmlFor="contenu">Contenu (Produit)</label>
          <select
           id="contenu"
             value={contenu}
             onChange={(e) => setContenu(e.target.value)}
              required
                >
               <option value="">Sélectionnez un produit</option>
                 {Array.isArray(produits) && produits.map((produit) => (
                <option key={produit.id} value={produit.designation}>
                {produit.designation}
                </option>
                 ))}
              </select>
              </div>

            <div className="input-group">
           <label htmlFor="cuve">Cuve Associée</label>
           <select
             id="cuve"
             value={cuve}
             onChange={(e) => setCuve(Number(e.target.value))}  // Stocker l'ID de la cuve sélectionnée
             required
              >
             <option value="">Sélectionnez une cuve</option>
              {Array.isArray(cuves) && cuves.map((cuve) => (
             <option key={cuve.id} value={cuve.id}>
             {cuve.nom} 
             </option>
             ))}
             </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>Annuler</button>
          <button type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePompe;