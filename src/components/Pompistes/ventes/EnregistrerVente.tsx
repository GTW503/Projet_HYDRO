import React, { useState, useEffect } from 'react';
import './EnregistrerVente.css'; // Import the CSS for styling

interface VenteProps {
  onClose: () => void;
  clients: string[]; // List of clients fetched from backend
  produits: string[]; // List of products fetched from backend
  categories: string[]; // List of categories fetched from backend
}

const EnregistrerVente: React.FC<VenteProps> = ({ onClose, clients, produits, categories }) => {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [filteredClients, setFilteredClients] = useState<string[]>(clients);
  const [nomClient, setNomClient] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('+228');
  const [email, setEmail] = useState<string>('');
  const [selectedProduit, setSelectedProduit] = useState<string>('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('');
  const [quantite, setQuantite] = useState<number>(0);
  const [prixUnitaire, setPrixUnitaire] = useState<number>(0);
  const [prixTotal, setPrixTotal] = useState<number>(0);
  const [imprimerFacture, setImprimerFacture] = useState<boolean>(false);

  const TVA = 0.18; // Tax rate of 18%

  // Update the total price whenever quantity or unit price changes
  useEffect(() => {
    const totalSansTaxe = quantite * prixUnitaire;
    const taxeCalculee = totalSansTaxe * TVA;
    setPrixTotal(totalSansTaxe + taxeCalculee);
  }, [quantite, prixUnitaire]);

  // Filter clients based on input (auto-suggestion)
  useEffect(() => {
    if (nomClient) {
      setFilteredClients(
        clients.filter(client =>
          client.toLowerCase().includes(nomClient.toLowerCase())
        )
      );
    } else {
      setFilteredClients(clients);
    }
  }, [nomClient, clients]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImprimerFacture(true);
  };

  // Get today's date and time
  const getTodayDate = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getCurrentTime = (): string => {
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Validate Togo phone number with country code +228
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.startsWith('+228') && input.length <= 12) {
      setTelephone(input);
    }
  };

  return (
    <div className="enregistrer-vente-container">
      {!imprimerFacture ? (
        <form onSubmit={handleSubmit} className="vente-form">
          <h2>Enregistrer une Vente</h2>

          {/* Select or Input Client */}
          <label>
            Client :
            <input
              type="text"
              placeholder="Nom du client"
              value={nomClient}
              onChange={(e) => setNomClient(e.target.value)}
              list="clients-list"
              autoComplete="off"
              required
            />
            <datalist id="clients-list">
              {filteredClients.map((client, index) => (
                <option key={index} value={client} />
              ))}
            </datalist>
          </label>

          <label>
            Numéro de Téléphone (+228) :
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              value={telephone}
              onChange={handlePhoneNumberChange}
              pattern="^\+228\d{8}$"
              required
            />
          </label>

          <label>
            Adresse E-mail :
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Product and Category Selection */}
          <label>
            Produit :
            <select
              value={selectedProduit}
              onChange={(e) => setSelectedProduit(e.target.value)}
              required
            >
              <option value="">Sélectionner un produit</option>
              {produits.map((produit, index) => (
                <option key={index} value={produit}>{produit}</option>
              ))}
            </select>
          </label>

          <label>
            Catégorie :
            <select
              value={selectedCategorie}
              onChange={(e) => setSelectedCategorie(e.target.value)}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((categorie, index) => (
                <option key={index} value={categorie}>{categorie}</option>
              ))}
            </select>
          </label>

          {/* Quantity and Price */}
          <label>
            Quantité :
            <input
              type="number"
              placeholder="Quantité"
              value={quantite}
              onChange={(e) => setQuantite(Number(e.target.value))}
              required
            />
          </label>

          <label>
            Prix Unitaire :
            <input
              type="number"
              placeholder="Prix unitaire"
              value={prixUnitaire}
              onChange={(e) => setPrixUnitaire(Number(e.target.value))}
              required
            />
          </label>

          <label>
            Prix Total : {prixTotal.toFixed(2)} FCFA
          </label>

          {/* Submit Button */}
          <button type="submit" className="submit-button">Enregistrer la Vente</button>
        </form>
      ) : (
        <div className="facture">
          <h2>Facture</h2>
          <div className="facture-header">
            <img src="/Logo.webp" alt="Logo Carburis" className="logo-facture" />
            <div className="station-details">
              <p>Carburis - Station XYZ</p>
              <p>Téléphone : 123-456-789</p>
              <p>Date : {getTodayDate()} | Heure : {getCurrentTime()}</p>
            </div>
          </div>
          <hr />

          {/* Invoice Content */}
          <div className="facture-content">
            <p>Client : {nomClient || selectedClient}</p>
            <p>Téléphone : {telephone}</p>
            <p>Produit : {selectedProduit}</p>
            <p>Catégorie : {selectedCategorie}</p>
            <p>Quantité : {quantite}</p>
            <p>Prix Unitaire : {prixUnitaire} FCFA</p>
            <p>Taxe (18%) : {(prixTotal - (quantite * prixUnitaire)).toFixed(2)} €</p>
            <h3>Total à Payer : {prixTotal.toFixed(2)} FCFA</h3>
          </div>

          {/* Button to Print the Invoice */}
          <button onClick={() => window.print()} className="print-button">
            Imprimer la Facture
          </button>

          {/* Button to Close the Modal */}
          <button onClick={onClose} className="close-button">
            Fermer
          </button>
        </div>
      )}
    </div>
  );
};

export default EnregistrerVente;
