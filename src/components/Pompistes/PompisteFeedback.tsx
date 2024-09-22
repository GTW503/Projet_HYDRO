import React, { useState } from 'react';
import createApiInstance from '../../services/axiosConfig';
import './PompisteFeedback.css'; // Importer le style CSS pour le formulaire et le modale

const PompisteFeedback: React.FC = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState<boolean>(false); // Contrôle du modale
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(true); // Contrôle la visibilité du formulaire

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const api = createApiInstance('pompistes/feedback');
      const response = await api.post('/feedback.php', { message });

      if (response.data.success) {
        setSuccess(true); // Afficher le modale
        setMessage(''); // Réinitialiser le champ de texte
      } else {
        setError(response.data.message || 'Erreur lors de l\'envoi du message.');
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi du message.');
    }
  };

  // Fonction pour fermer le modale et cacher le formulaire
  const closeModal = () => {
    setSuccess(false); // Fermer le modale
    setIsFormVisible(false); // Cacher le formulaire après l'envoi du message
  };

  return (
    <div className="pompiste-feedback-container">
      {isFormVisible && ( // Afficher le formulaire uniquement s'il est visible
        <>
          <h2>Envoyer un message au gérant</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message"
              rows={5}
              required
            />
            <button type="submit">Envoyer</button>
          </form>

          {error && <p className="error-message">{error}</p>}

          {/* Modale de confirmation */}
          {success && (
            <div className="modal">
              <div className="modal-content">
                <h3>Succès</h3>
                <p>Votre message a été envoyé avec succès.</p>
                <button onClick={closeModal} className="ok-button">OK</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PompisteFeedback;
