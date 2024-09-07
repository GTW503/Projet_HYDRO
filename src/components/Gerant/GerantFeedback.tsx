// GerantFeedback.tsx
import React from 'react';

interface GerantFeedbackProps {
  feedbacks: string[];
}

const GerantFeedback: React.FC<GerantFeedbackProps> = ({ feedbacks }) => {
  return (
    <div className="gerant-feedback-container">
      <h2>Feedbacks des Pompistes</h2>
      <ul>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <li key={index}>{feedback}</li>
          ))
        ) : (
          <p>Aucun feedback pour le moment.</p>
        )}
      </ul>
    </div>
  );
};

export default GerantFeedback;
