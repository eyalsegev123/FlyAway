import React, { useState } from "react";
import axios from "axios";
import "../styles/pages/PlanTrip.css";

const PlanTrip = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [length, setLength] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD"); // Default currency
  const [tripGenre, setTripGenre] = useState([]);
  const [travelers, setTravelers] = useState("");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false); // Added missing state for travelers dropdown
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenreChange = (genre) => {
    setTripGenre((prevGenres) => {
      if (prevGenres.includes(genre)) {
        return prevGenres.filter((g) => g !== genre);
      } else {
        return [...prevGenres, genre];
      }
    });
  };

  const handleGenreDropdownToggle = () => {
    setShowGenreDropdown(!showGenreDropdown);
  };

  const handleCloseDropdown = () => {
    setShowGenreDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/openAiRoutes/planTrip`, // Replace with your OpenAI controller URL
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

      <div className="form-group">
        <label htmlFor="destination">Destination</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="length">Length of Trip (in days)</label>
        <input
          type="number"
          id="length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="budget">Budget</label>
        <input
          type="number"
          id="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="currency">Currency</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          required
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="NIS">NIS</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tripGenre">Trip Genre (Select multiple)</label>
        <div className="dropdown">
          <button
            type="button"
            className="dropdown-toggle"
            onClick={handleGenreDropdownToggle}
          >
            {tripGenre.length === 0 ? "Select genres" : tripGenre.join(", ")}
          </button>
          {showGenreDropdown && (
            <div className="dropdown-menu">
              {["Sport", "Nightlife", "Restaurant", "Extreme"].map((genre) => (
                <label key={genre} className="dropdown-item">
                  <input
                    type="checkbox"
                    checked={tripGenre.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                  />
                  {genre}
                </label>
              ))}
            </div>
          )}
        </div>
        {showGenreDropdown && (
          <button
            type="button"
            className="close-dropdown"
            onClick={handleCloseDropdown}
          >
            Close
          </button>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="travelers">Travelers</label>
        <div className="dropdown">
          <button
            type="button"
            className="dropdown-toggle"
            onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}
          >
            {travelers || "Select travelers"}
          </button>
          {showTravelersDropdown && (
            <div className="dropdown-menu">
              {["couple", "couples", "family", "families", "friends(women)", "friends(men)"].map(
                (traveler) => (
                  <label key={traveler} className="dropdown-item">
                    <input
                      type="radio"
                      name="travelers"
                      checked={travelers === traveler}
                      onChange={() => setTravelers(traveler)}
                    />
                    {traveler}
                  </label>
                )
              )}
            </div>
          )}
        </div>
      </div>

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
