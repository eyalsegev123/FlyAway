import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "../styles/pages/PlanTrip.css";

const PlanTrip = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [length, setLength] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [tripGenre, setTripGenre] = useState([]);
  const [travelers, setTravelers] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tripRecommendation, setTripRecommendation] = useState(null); // Store response from the server

  const navigate = useNavigate(); // Hook for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/openAiRoutes/planTrip`,
        {
          destination,
          startDate,
          endDate,
          length,
          budget,
          currency,
          tripGenre,
          travelers,
        }
      );

      if (response.status === 200) {
        console.log("Response from OpenAI:", response.data);
        setTripRecommendation(response.data); // Save response to state
        navigate("/recommendation", { state: { tripRecommendation: response.data } }); // Pass the response data via state
      }
    } catch (err) {
      setErrorMessage("An error occurred while submitting the trip details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-trip-container">
      <h1>Plan Your Trip</h1>
      <p>Use our tools to plan the perfect vacation for you!</p>
      {/* Your input fields go here... */}

      <div className="form-group">
        <button
          type="submit"
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default PlanTrip;
