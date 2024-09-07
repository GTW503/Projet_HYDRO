// PompisteFeedback.tsx
import React, { useState } from 'react';

interface PompisteFeedbackProps {
  onFeedbackSubmit: (message: string) => void;
  onClose: () => void;
}

const PompisteFeedback: React.FC<PompisteFeedbackProps> = ({ onFeedbackSubmit, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onFeedbackSubmit(message);
      setMessage('');
      onClose();
    }
  };

  return (
    <div className="feedback-container">
      <h2>Envoyer un Feedback</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrivez votre message ici..."
          rows={5}
          required
        />
        <button type="submit">Envoyer</button>
      </form>
      <button onClick={onClose}>Fermer</button>
    </div>
  );
};

export default PompisteFeedback;
