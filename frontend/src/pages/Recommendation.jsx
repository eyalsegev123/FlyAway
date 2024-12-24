// Recommendation.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth for auth management
import Header from '../components/Header';
import WishlistButton from '../components/WishlistButton';

const Recommendation = () => {
  const location = useLocation();
  const { tripRecommendation } = location.state || {};
  const { user } = useAuth(); // Get user from context

  if (!tripRecommendation) {
    return <div className="recommendation-container"><Header /><p>No recommendations found.</p></div>;
  }

  return (
    <div className="recommendation-container">
      <Header />
      <h2>Your Trip Recommendations</h2>
      <div>
        <strong>Response from OpenAI:</strong>
        <p>{tripRecommendation.answer}</p>
      </div>
      {user && <WishlistButton onClick={() => console.log('Add to wishlist')} />}
    </div>
  );
};

export default Recommendation;
