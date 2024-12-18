import React from "react";
import { useLocation } from "react-router-dom";

const Recommendation = () => {
  const location = useLocation(); // Access location state
  const { tripRecommendation } = location.state || {}; // Destructure the passed state
  
  if (!tripRecommendation) {
    return <p>No recommendations found.</p>; // In case the state is missing or not yet loaded
  }

  return (
    <div className="recommendation-container">
      <h2>Your Trip Recommendations</h2>
      <div>
        <strong>Response from OpenAI:</strong>
        <p>{tripRecommendation.answer}</p> {/* Display answer from response */}
      </div>
    </div>
  );
};

export default Recommendation;
