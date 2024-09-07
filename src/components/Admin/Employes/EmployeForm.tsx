import React, { useState, useEffect } from 'react';
import 'react-phone-input-2/lib/style.css'; // Importer le style CSS
import PhoneInput from 'react-phone-input-2';
import './EmployeForm.css';

const EmployeForm: React.FC = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');
  const [situationMatrimoniale, setSituationMatrimoniale] = useState('');
  const [numeroCompte, setNumeroCompte] = useState('');
  const [personneAPrevenir, setPersonneAPrevenir] = useState('');
  const [numeroPersonne, setNumeroPersonne] = useState('');
  const [nationalite, setNationalite] = useState('');
  const [numeroMatricule, setNumeroMatricule] = useState('');
  const [posteOccupe, setPosteOccupe] = useState('');
  const [numeroCarteIdentite, setNumeroCarteIdentite] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [telephonePersonneAPrevenir, setTelephonePersonneAPrevenir] = useState('');

  // Fonction pour calculer l'âge
  const calculateAge = (date: string) => {
    const birthYear = new Date(date).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  // Fonction pour générer un numéro matricule
  const generateNumeroMatricule = (name: string) => {
    const letters = name.slice(0, 2).toUpperCase();
    const randomNumbers = Math.floor(100 + Math.random() * 900); // Génère un nombre aléatoire entre 100 et 999
    return `${letters}${randomNumbers}`;
  };

  // Gérer le changement du nom pour générer le numéro matricule
  useEffect(() => {
    if (nom) {
      setNumeroMatricule(generateNumeroMatricule(nom));
    }
  }, [nom]);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Valider les champs obligatoires et gérer la logique de soumission
  };

  // Fonction pour gérer la sélection d'une photo
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  // Gérer le changement de date de naissance pour calculer l'âge
  const handleDateNaissanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateNaissance(e.target.value);
    setAge(calculateAge(e.target.value));
  };

  return (
    <div className="employe-form-container">
      <form onSubmit={handleSubmit} className="employe-form">
      <button type="button" className="close-button" onClick={() => navigate('/admin')}>
          &#x2716; {/* Utiliser l'entité HTML pour afficher une croix */}
        </button>
        <h2>Formulaire de gestion des Employés</h2>
        <div className="form-row">
          <label>
            Nom:
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </label>
          <label>
            Prénom:
            <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
          </label>
        </div>
        <div className="form-row">
          <label>
            Date de Naissance:
            <input type="date" value={dateNaissance} onChange={handleDateNaissanceChange} required />
          </label>
          <label>
            Âge:
            <input type="number" value={age} readOnly />
          </label>
        </div>
        <div className="form-row">
          <label>
            Adresse Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Situation Matrimoniale:
            <select value={situationMatrimoniale} onChange={(e) => setSituationMatrimoniale(e.target.value)} required>
              <option value="">Sélectionnez</option>
              <option value="Marié">Marié</option>
              <option value="Célibataire">Célibataire</option>
              <option value="Divorcé">Divorcé</option>
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Numéro de Téléphone:
            <PhoneInput
              country={'tg'}
              value={telephone}
              onChange={setTelephone}
              inputStyle={{ width: '100%' }}
              containerStyle={{ width: '100%' }}
              required
            />
          </label>
          <label>
            Numéro de Compte Bancaire:
            <input type="text" value={numeroCompte} onChange={(e) => setNumeroCompte(e.target.value)} required />
          </label>
        </div>
        <div className="form-row">
          <label>
            Personne à Prévenir:
            <input type="text" value={personneAPrevenir} onChange={(e) => setPersonneAPrevenir(e.target.value)} required />
          </label>
          <label>
            Numéro de Téléphone de la Personne:
            <PhoneInput
              country={'tg'}
              value={telephonePersonneAPrevenir}
              onChange={setTelephonePersonneAPrevenir}
              inputStyle={{ width: '100%' }}
              containerStyle={{ width: '100%' }}
              required
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Nationalité:
            <input type="text" value={nationalite} onChange={(e) => setNationalite(e.target.value)} required />
          </label>
        </div>
        <div className="form-row">
          <label>
            Numéro Matricule:
            <input type="text" value={numeroMatricule} readOnly />
          </label>
          <label>
            Poste Occupé:
            <select value={posteOccupe} onChange={(e) => setPosteOccupe(e.target.value)} required>
              <option value="">Sélectionnez</option>
              <option value="Gérant">Gérant</option>
              <option value="Admin">Admin</option>
              <option value="Pompiste">Pompiste</option>
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Numéro de Carte Nationale d'Identité:
            <input type="text" value={numeroCarteIdentite} onChange={(e) => setNumeroCarteIdentite(e.target.value)} required />
          </label>
          <label>
            Photo de l'Employé:
            <input type="file" onChange={handlePhotoChange} required />
          </label>
        </div>
        <div className="form-row">
          <label>
            Mot de Passe:
            <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
          </label>
          <label>
            Confirmation du Mot de Passe:
            <input type="password" value={confirmationMotDePasse} onChange={(e) => setConfirmationMotDePasse(e.target.value)} required />
          </label>
        </div>
        <button type="submit" className="submit-button">Enregistrer</button>
      </form>
    </div>
  );
};

export default EmployeForm;
