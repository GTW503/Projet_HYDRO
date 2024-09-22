import React, { useEffect, useState } from 'react';
import createApiInstance from '../../services/axiosConfig';
import './GerantFeedback.css'; // Importer le style CSS

interface Feedback {
  id: number;
  message: string;
  date_sent: string;
  status: string; // 'non_traite', 'en_cours', 'traite'
  notification: string | null; // Notification envoyée au pompiste
}

const GerantFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ startDate: '', endDate: '' }); // Filtre de dates

  useEffect(() => {
    fetchFeedbacks();
  }, [filter]);

  // Fonction pour récupérer les feedbacks (avec ou sans filtre de date)
  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);

    try {
      const api = createApiInstance('pompistes/feedback');
      const params = filter.startDate && filter.endDate ? { startDate: filter.startDate, endDate: filter.endDate } : {};
      const response = await api.get('/feedback.php', { params });

      if (response.data.success) {
        setFeedbacks(response.data.feedbacks);
      } else {
        setError(response.data.message || 'Erreur lors de la récupération des feedbacks.');
      }
    } catch (error) {
      setError('Erreur lors de la récupération des feedbacks.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour le statut d'un feedback et notifier le pompiste
  const updateStatus = async (feedbackId: number, status: string) => {
    try {
      const notificationMessage = status === 'traite' ? 'Votre problème est traité.' : 'Votre problème est en cours de traitement.';

      const api = createApiInstance('pompistes/feedback');
      const response = await api.put('/feedback.php', {
        id: feedbackId,
        status,
        notification: notificationMessage, // Envoi de la notification
      });

      if (response.data.success) {
        setFeedbacks(prevFeedbacks =>
          prevFeedbacks.map(fb =>
            fb.id === feedbackId ? { ...fb, status, notification: notificationMessage } : fb
          )
        );
      } else {
        setError(response.data.message || 'Erreur lors de la mise à jour du statut.');
      }
    } catch (error) {
      setError('Erreur lors de la mise à jour du statut.');
    }
  };

  return (
    <div className="gerant-feedback-container">
      <h2>Feedbacks des Pompistes</h2>

      {/* Filtrer les feedbacks par date */}
      <div className="filter-container">
        <input
          type="date"
          value={filter.startDate}
          onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
          placeholder="Date de début"
        />
        <input
          type="date"
          value={filter.endDate}
          onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          placeholder="Date de fin"
        />
        <button onClick={fetchFeedbacks}>Filtrer</button>
      </div>

      {loading ? (
        <p className="loader">Chargement des feedbacks...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="feedback-list">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <li key={feedback.id} className={`feedback-item ${feedback.status}`}>
                <p>{feedback.message}</p>
                <small>{new Date(feedback.date_sent).toLocaleString()}</small>

                {/* Notification affichée */}
                {feedback.notification && (
                  <div className="notification">
                    <strong>Notification :</strong> {feedback.notification}
                  </div>
                )}

                {/* Boutons pour changer le statut */}
                <div className="status-buttons">
                  <button
                    className={`status-button ${feedback.status === 'en_cours' ? 'active' : ''}`}
                    onClick={() => updateStatus(feedback.id, 'en_cours')}
                  >
                    En cours de traitement
                  </button>
                  <button
                    className={`status-button ${feedback.status === 'traite' ? 'active' : ''}`}
                    onClick={() => updateStatus(feedback.id, 'traite')}
                  >
                    Traité
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>Aucun feedback pour le moment.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default GerantFeedback;
