import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importation de useNavigate pour la redirection
import PhoneInput from 'react-phone-input-2'; // Importation de PhoneInput pour la gestion des numéros de téléphone
import 'react-phone-input-2/lib/style.css';  // Styles pour PhoneInput
import './EmployeForm.css';  // Styles CSS
import createApiInstance from '../../../services/axiosConfig';  // Importation d'Axios configuré

const EmployeForm: React.FC = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');
  const [situationMatrimoniale, setSituationMatrimoniale] = useState('');
  const [numeroCompte, setNumeroCompte] = useState('');
  const [personneAPrevenir, setPersonneAPrevenir] = useState('');
  const [telephonePersonneAPrevenir, setTelephonePersonneAPrevenir] = useState('');
  const [nationalite, setNationalite] = useState('');
  const [numeroMatricule, setNumeroMatricule] = useState('');
  const [posteOccupe, setPosteOccupe] = useState('');
  const [numeroCarteIdentite, setNumeroCarteIdentite] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);  // Pour la gestion de la photo
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const api = createApiInstance('admin/employes');  // Instance Axios pour communiquer avec le backend
  const navigate = useNavigate();  // Pour la redirection après soumission

  // Calcul de l'âge à partir de la date de naissance
  const calculateAge = (date: string) => {
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Générer un numéro matricule en fonction du nom
  const generateNumeroMatricule = (name: string) => {
    const initials = name.slice(0, 2).toUpperCase();
    const randomNumbers = Math.floor(100 + Math.random() * 900);
    return `${initials}${randomNumbers}`;
  };

  // Mettre à jour le numéro matricule en fonction du nom
  useEffect(() => {
    if (nom) {
      setNumeroMatricule(generateNumeroMatricule(nom));
    }
  }, [nom]);

  // Mettre à jour l'âge lorsque la date de naissance change
  const handleDateNaissanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setDateNaissance(date);
    setAge(calculateAge(date));
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification que les mots de passe correspondent
    if (motDePasse !== confirmationMotDePasse) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    const formData = new FormData();  // Utilisation de FormData pour inclure la photo et les autres champs
    formData.append('nom', nom);
    formData.append('prenom', prenom);
    formData.append('dateNaissance', dateNaissance);
    formData.append('age', age.toString());
    formData.append('email', email);
    formData.append('situationMatrimoniale', situationMatrimoniale);
    formData.append('numeroCompte', numeroCompte);
    formData.append('personneAPrevenir', personneAPrevenir);
    formData.append('telephonePersonneAPrevenir', telephonePersonneAPrevenir);
    formData.append('nationalite', nationalite);
    formData.append('numeroMatricule', numeroMatricule);
    formData.append('posteOccupe', posteOccupe);
    formData.append('numeroCarteIdentite', numeroCarteIdentite);
    formData.append('motDePasse', motDePasse);
    formData.append('telephone', telephone);

    // Ajout de la photo à FormData si elle est présente
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const response = await api.post('/index.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Employé créé avec succès!');
      setErrorMessage('');  // Effacer les erreurs en cas de succès
      console.log('Employé créé avec succès:', response.data);

      // Redirection après soumission réussie
      navigate('/admin');
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      setErrorMessage("Erreur lors de la création de l'employé");
    }
  };

  // Gestion de la sélection de la photo
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);  // Stocker la photo dans l'état
    }
  };

  return (
    <div className="employe-form-container">
      <button type="button" className="close-button" onClick={() => navigate('/admin')}>
        &#x2716; {/* Bouton pour fermer le formulaire */}
      </button>

      <form onSubmit={handleSubmit} className="employe-form">
        <h2>Formulaire de gestion des Employés</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

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
            <input type="int" value={age} readOnly />
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
