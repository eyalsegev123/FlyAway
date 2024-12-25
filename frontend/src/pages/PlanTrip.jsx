import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/pages/PlanTrip.css";
import Header from "../components/Header";

const PlanTrip = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripLength, setTripLength] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [tripGenres, setTripGenres] = useState([]);
  const [travelers, setTravelers] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [tripRecommendation, setTripRecommendation] = useState(null);

  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);

  const navigate = useNavigate();

  // Toggle genre dropdown
  const handleGenreDropdownToggle = () => {
    setShowGenreDropdown(!showGenreDropdown);
  };

  // Handle genre selection
  const handleGenreChange = (genre) => {
    setTripGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : [...prev, genre]
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `http://localhost:5001/api/openAiRoutes/planTrip`,
        {
          destination,
          startDate,
          endDate,
          tripLength,
          budget,
          currency,
          tripGenres,
          travelers,
        }
      );

      if (response.status === 200) {
        console.log(destination, startDate, endDate, tripLength, budget); 
        navigate("/Recommendation", {
          state: {
            destination: destination,
            start_range: startDate,
            end_range: endDate,
            trip_genre: tripGenres.join(", "),
            trip_length: tripLength,
            budget: budget,
            content: response.data, // OpenAi answer
          },
        });
      }
    } catch (err) {
      setErrorMessage("An error occurred while submitting the trip details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-trip-page">
      <Header />
      <div className="plan-trip-content">
        <h1 className="plan-trip-title">Plan Your Trip</h1>
        <p className="plan-trip-subtitle">
          Use our tools to plan the perfect vacation for you!
        </p>

        <form className="trip-form" onSubmit={handleSubmit}>
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
            <label htmlFor="tripLength">Length of Trip (in days)</label>
            <input
              type="number"
              id="tripLength"
              value={tripLength}
              onChange={(e) => setTripLength(e.target.value)}
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
            <label htmlFor="tripGenres">Trip Genre (Select multiple)</label>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-toggle"
                onClick={handleGenreDropdownToggle}
              >
                {tripGenres.length === 0
                  ? "Select genres"
                  : tripGenres.join(", ")}
              </button>
              {showGenreDropdown && (
                <div className="dropdown-menu">
                  {["Sport", "Nightlife", "Restaurant", "Extreme"].map(
                    (genre) => (
                      <label key={genre} className="dropdown-item">
                        <input
                          type="checkbox"
                          checked={tripGenres.includes(genre)}
                          onChange={() => handleGenreChange(genre)}
                        />
                        {genre}
                      </label>
                    )
                  )}
                </div>
              )}
            </div>
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
                  {[
                    "Couple",
                    "Couples",
                    "Family",
                    "Families",
                    "Friends (Women)",
                    "Friends (Men)",
                  ].map((traveler) => (
                    <label key={traveler} className="dropdown-item">
                      <input
                        type="radio"
                        name="travelers"
                        checked={travelers === traveler}
                        onChange={() => setTravelers(traveler)}
                      />
                      {traveler}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default PlanTrip;
