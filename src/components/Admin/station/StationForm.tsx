import React, { useState } from 'react';
import createApiInstance from '../../../services/axiosConfig'; // Importer l'instance Axios configurée

interface StationFormProps {
  onClose: () => void;
  onSave: (data: StationData) => void;
}

interface StationData {
  designation: string;
  activites: string;
  identifiantFiscal: string;
  numeroCompte: string;
  commune: string;
  adresseMail: string;
  registreCommerce: string;
  logo: File | null;
}

const StationForm: React.FC<StationFormProps> = ({ onClose, onSave }) => {
  const [designation, setDesignation] = useState('');
  const [activites, setActivites] = useState('');
  const [identifiantFiscal, setIdentifiantFiscal] = useState('');
  const [numeroCompte, setNumeroCompte] = useState('');
  const [commune, setCommune] = useState('');
  const [adresseMail, setAdresseMail] = useState('');
  const [registreCommerce, setRegistreCommerce] = useState('');
  const [logo, setLogo] = useState<File | null>(null);

  // Création d'une instance Axios pour le sous-dossier "admin/stations"
  const api = createApiInstance('admin/stations');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Utilisation de FormData pour envoyer les données et le fichier
    const formData = new FormData();
    formData.append('designation', designation);
    formData.append('activites', activites);
    formData.append('identifiantFiscal', identifiantFiscal);
    formData.append('numeroCompte', numeroCompte);
    formData.append('commune', commune);
    formData.append('adresseMail', adresseMail);
    formData.append('registreCommerce', registreCommerce);
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      // Envoyer les données via Axios au backend
      const response = await api.post('/station.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Station créée avec succès:', response.data);

      // Appeler la fonction onSave pour traiter les données
      onSave({
        designation,
        activites,
        identifiantFiscal,
        numeroCompte,
        commune,
        adresseMail,
        registreCommerce,
        logo,
      });
      onClose(); // Fermer le formulaire après la soumission réussie
    } catch (error) {
      console.error('Erreur lors de la création de la station:', error);
      alert('Une erreur est survenue lors de la création de la station.');
    }
  };

  return (
    <div className="station-form-container">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Enregistrer la Station</h2>
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
          Activités:
          <input
            type="text"
            value={activites}
            onChange={(e) => setActivites(e.target.value)}
            required
          />
        </label>
        <label>
          Identifiant Fiscal:
          <input
            type="text"
            value={identifiantFiscal}
            onChange={(e) => setIdentifiantFiscal(e.target.value)}
            required
          />
        </label>
        <label>
          Numéro de Compte:
          <input
            type="text"
            value={numeroCompte}
            onChange={(e) => setNumeroCompte(e.target.value)}
            required
          />
        </label>
        <label>
          Commune:
          <input
            type="text"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            required
          />
        </label>
        <label>
          Adresse Mail:
          <input
            type="email"
            value={adresseMail}
            onChange={(e) => setAdresseMail(e.target.value)}
            required
          />
        </label>
        <label>
          Registre de Commerce:
          <input
            type="text"
            value={registreCommerce}
            onChange={(e) => setRegistreCommerce(e.target.value)}
            required
          />
        </label>
        <label>
          Logo de l'Entreprise:
          <input
            type="file"
            onChange={(e) => setLogo(e.target.files?.[0] || null)}
          />
        </label>
        <button type="submit" className="save-button">Enregistrer</button>
      </form>
    </div>
  );
};

export default StationForm;
