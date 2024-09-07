import jsPDF from 'jspdf';

const generatePDF = (venteData: any, stationData: any) => {
  const doc = new jsPDF();
  
  // Ajoutez les informations de la station en tant qu'en-tête
  doc.setFontSize(18);
  doc.text(stationData.nom, 10, 10);
  doc.setFontSize(12);
  doc.text(`Adresse: ${stationData.adresse}`, 10, 20);
  doc.text(`Téléphone: ${stationData.telephone}`, 10, 30);
  doc.text(`Email: ${stationData.email}`, 10, 40);
  doc.text(`Identifiant Fiscal: ${stationData.identifiantFiscal}`, 10, 50);
  doc.text(`Registre Commercial: ${stationData.registreCommercial}`, 10, 60);
  doc.addImage(stationData.logo, 'JPEG', 150, 10, 40, 40); // Si le logo est un fichier image
  
  // Ajoutez les détails de la vente
  doc.setFontSize(16);
  doc.text('Détails de la Vente', 10, 80);
  doc.setFontSize(12);
  doc.text(`Produit: ${venteData.produit}`, 10, 90);
  doc.text(`Quantité: ${venteData.quantite}`, 10, 100);
  doc.text(`Prix: ${venteData.prix}`, 10, 110);
  
  doc.save('vente.pdf');
};

// Appel de cette fonction lors de la soumission du formulaire
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const venteData = {
    produit: 'Essence',
    quantite: 100,
    prix: 500,
  };
  
  // Supposons que stationData contient les informations de la station
  const stationData = {
    nom: 'Station XYZ',
    adresse: '123 Rue de Paris, Paris',
    telephone: '01 23 45 67 89',
    email: 'contact@stationxyz.com',
    identifiantFiscal: 'FR123456789',
    registreCommercial: 'RC123456789',
    logo: 'path/to/logo.jpg', // Si le logo est une image stockée localement
  };
  
  generatePDF(venteData, stationData);
};
