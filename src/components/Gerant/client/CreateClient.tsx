import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Pour la redirection
import createApiInstance from '../../../services/axiosConfig'; // Assurez-vous d'importer correctement votre configuration Axios
import 'react-phone-input-2/lib/style.css'; // Importer le style pour react-phone-input-2
import PhoneInput from 'react-phone-input-2'; // Importer react-phone-input-2
import './CreateClient.css'; // Ajoutez votre fichier de styles si nécessaire

interface CreateClientProps {
  onClose: () => void;
  onCreateClient: () => void; // Pas besoin de passer les données ici
}

const CreateClient: React.FC<CreateClientProps> = ({ onClose, onCreateClient }) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Pour gérer l'état du chargement
  const [error, setError] = useState(''); // Pour afficher les erreurs s'il y en a
  const [phoneError, setPhoneError] = useState(''); // Pour gérer les erreurs liées au numéro de téléphone

  const navigate = useNavigate(); // Utiliser pour rediriger vers le dashboard

  // Instance API avec la bonne route backend
  const api = createApiInstance('gerant/client'); // Crée une instance d'API pour le sous-dossier client

  const handleCreate = async () => {
    if (!nom || !prenom || !telephone || !email) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    // Validation du téléphone : vérifier si le numéro fait bien 8 chiffres après l'indicatif
    const cleanNumber = telephone.replace(/\D/g, ''); // Supprime tout caractère non numérique
    const togoPhoneNumber = cleanNumber.substring(3); // Supprime l'indicatif +228
    if (togoPhoneNumber.length !== 8) {
      setPhoneError('Le numéro de téléphone doit comporter exactement 8 chiffres après l\'indicatif.');
      return;
    }

    const client = {
      nom,
      prenom,
      telephone,
      email,
    };

    try {
      setLoading(true); // Affiche un spinner de chargement ou autre indicateur

      // Envoyer les données au backend via POST
      const response = await api.post('/client.php', client); // On envoie les données du client à l'endpoint de création

      if (response.data.success) {
        alert('Client créé avec succès!');
        onCreateClient(); // Appelle la fonction onCreateClient pour rafraîchir la liste des clients après création
        resetForm(); // Réinitialise le formulaire
        navigate('/dashboard'); // Redirige vers le dashboard du gérant
      } else if (response.data.message === 'Client déjà existant') {
        setError('Le numéro de téléphone est déjà enregistré pour un autre client.');
      } else {
        setError(response.data.message || 'Erreur lors de la création du client.');
      }
    } catch (error) {
      setError('Erreur réseau ou serveur.');
    } finally {
      setLoading(false); // Arrête le spinner de chargement
    }
  };

  const resetForm = () => {
    // Réinitialiser tous les champs du formulaire
    setNom('');
    setPrenom('');
    setTelephone('');
    setEmail('');
    setError('');
    setPhoneError('');
  };

  const handlePhoneChange = (value: string) => {
    setTelephone(value);
    const cleanNumber = value.replace(/\D/g, '');
    const togoPhoneNumber = cleanNumber.substring(3); // Supprime l'indicatif +228

    if (togoPhoneNumber.length > 8) {
      setPhoneError('Le numéro de téléphone ne doit pas dépasser 8 chiffres après l\'indicatif.');
    } else {
      setPhoneError('');
    }
  };

  return (
    <div className="create-client-modal">
      <h2>Créer un Client</h2>

      {/* Afficher une erreur s'il y en a */}
      {error && <p className="error-message">{error}</p>}

      {/* Nom */}
      <label htmlFor="nom">Nom:</label>
      <input
        type="text"
        id="nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Nom"
      />

      {/* Prénom */}
      <label htmlFor="prenom">Prénom:</label>
      <input
        type="text"
        id="prenom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        placeholder="Prénom"
      />

      {/* Téléphone avec +228 */}
      <label htmlFor="telephone">Téléphone:</label>
      <PhoneInput
        country={'tg'} // Code pays du Togo
        value={telephone}
        onChange={handlePhoneChange}
        inputProps={{
          name: 'telephone',
          required: true,
          autoFocus: true,
        }}
        preferredCountries={['tg']} // Préférer le Togo dans la sélection
        enableSearch={true}
        disableDropdown={true} // Désactiver la liste déroulante, car on souhaite uniquement le code +228
      />
      {phoneError && <span className="phone-error">{phoneError}</span>}

      {/* Adresse e-mail */}
      <label htmlFor="email">Adresse e-mail:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Adresse e-mail"
      />

      {/* Buttons */}
      <div className="buttons">
        <button onClick={handleCreate} disabled={loading}>
          {loading ? 'Création...' : 'Créer'}
        </button>
        <button onClick={onClose} disabled={loading}>Annuler</button>
      </div>
    </div>
  );
};

export default CreateClient;
