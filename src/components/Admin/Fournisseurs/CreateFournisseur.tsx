import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';  
import './CreateFournisseur.css';

const CreateFournisseur: React.FC<{ onClose: () => void; categories: string[] }> = ({ onClose, categories }) => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const livraisonOptions = [
    'Livraison journalière',
    'Livraison mensuelle',
    'Livraison annuelle',
    'Livraison hebdomadaire',
    'Livraison sur demande'
  ];

  const handlePhoneChange = (value: string, country: any) => {
    setPhone(value);
    // Le nombre maximum de chiffres autorisé pour le numéro de téléphone selon le format du pays
    const maxLength = country.dialCode === '228' ? 8 : country.format.replace(/[^.]/g, '').length; // Exemple : 8 chiffres pour le Togo (code 228)
    const digitCount = value.replace(/[^0-9]/g, '').length - country.dialCode.length;
    
    if (digitCount > maxLength) {
      setPhoneError(`Le numéro de téléphone ne peut pas dépasser ${maxLength} chiffres pour ${country.name}.`);
    } else {
      setPhoneError('');
    }
  };

  return (
    <div className="create-fournisseur-container">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Créer un Fournisseur</h2>
      <form>
        <label>
          Fournisseur:
          <input type="text" required />
        </label>
        <label>
          Adresse:
          <input type="text" required />
        </label>
        <label>
          Téléphone:
          <PhoneInput
            country={'us'} // Défaut au pays États-Unis
            value={phone}
            onChange={handlePhoneChange}
            inputProps={{
              name: 'phone',
              required: true,
              autoFocus: true
            }}
          />
          {phoneError && <span className="phone-error">{phoneError}</span>}
        </label>
        <label>
          Adresse mail:
          <input type="email" required />
        </label>
        <label>
          Catégorie de produit:
          <select required>
            <option value="">Sélectionner une catégorie</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          Livraison:
          <select required>
            <option value="">Sélectionner une option</option>
            {livraisonOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="save-button">Enregistrer</button>
      </form>
    </div>
  );
};

export default CreateFournisseur;
